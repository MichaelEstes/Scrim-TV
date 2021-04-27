package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/aws/aws-sdk-go/service/sqs"
	log "github.com/sirupsen/logrus"
)

const transcoderTemplate = "/var/lib/transcode/transcoder.sh %v %v"

var (
	svc          *sqs.SQS
	s3Downloader *s3manager.Downloader
	s3Uploader   *s3manager.Uploader
)

//SQSMessageBody get the key of the sqs message body
type SQSMessageBody struct {
	Records []struct {
		S3 struct {
			Object struct {
				ETag      string `json:"eTag"`
				Key       string `json:"key"`
				Sequencer string `json:"sequencer"`
				Size      int    `json:"size"`
			} `json:"object"`
		} `json:"s3"`
	} `json:"Records"`
}

func main() {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-east-2")},
	)
	if err != nil {
		panic("Can't get AWS session, killing process")
	}

	svc = sqs.New(sess)
	s3Downloader = s3manager.NewDownloader(sess)
	s3Uploader = s3manager.NewUploader(sess)

	for range time.NewTicker(5 * time.Second).C {
		handleSQS()
	}
}

func handleSQS() {
	qURL := "https://amazonaws.com/Queue ID/Scrim-Transcoding-Queue"
	result, success := recieveMessages(qURL)
	if success {
		if processMessages(result.Messages) {
			deleteMessages(qURL, result)
		}
	}
}

func recieveMessages(qURL string) (*sqs.ReceiveMessageOutput, bool) {
	result, err := svc.ReceiveMessage(&sqs.ReceiveMessageInput{
		AttributeNames: []*string{
			aws.String(sqs.MessageSystemAttributeNameSentTimestamp),
		},
		MessageAttributeNames: []*string{
			aws.String(sqs.QueueAttributeNameAll),
		},
		QueueUrl:            &qURL,
		MaxNumberOfMessages: aws.Int64(1),
		VisibilityTimeout:   aws.Int64(20), // 20 seconds
		WaitTimeSeconds:     aws.Int64(0),
	})

	if err != nil {
		log.Error("Error reading SQS message", err)
		return result, false
	}

	if len(result.Messages) == 0 {
		return result, false
	}

	return result, true
}

func processMessages(messages []*sqs.Message) bool {
	for _, message := range messages {
		body := message.Body
		var sqsMessage SQSMessageBody
		json.Unmarshal([]byte(*body), &sqsMessage)
		log.Infof("Received message: %+v\n", sqsMessage)

		for _, record := range sqsMessage.Records {
			key := record.S3.Object.Key
			log.Infof("Processing file with key: %v\n", key)
			ks := strings.Split(key, ".")
			name, ext := ks[0], ks[1]
			if ext == "mp4" {
				file, err := downloadFromS3(key)
				if err != nil {
					return false
				}

				err = transcodeFile(name, file)
				if err != nil {
					return false
				}

				err = uploadToS3(name)
				if err != nil {
					return false
				}

				cleanup(name)
			}
		}
	}

	return true
}

func deleteMessages(qURL string, result *sqs.ReceiveMessageOutput) {
	resultDelete, err := svc.DeleteMessage(&sqs.DeleteMessageInput{
		QueueUrl:      &qURL,
		ReceiptHandle: result.Messages[0].ReceiptHandle,
	})

	if err != nil {
		log.Error("Delete Error", err)
		return
	}

	log.Info("Message Deleted", resultDelete)
}

func downloadFromS3(key string) (string, error) {
	bucket := "scrim-ingestion"
	name := "/tmp/" + key
	file, err := os.Create(name)
	if err != nil {
		log.Error("Unable to create file name: "+name, err)
		return "", err
	}
	defer file.Close()

	numBytes, err := s3Downloader.Download(file,
		&s3.GetObjectInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
		})
	if err != nil {
		log.Error("Unable to download file from S3: "+key, err)
		return "", err
	}

	log.Infof("Downloaded %v bytes from S3 to %v ", numBytes, file.Name())
	return file.Name(), nil
}

func transcodeFile(name string, file string) error {
	transcoder := fmt.Sprintf(transcoderTemplate, name, file)
	ffmpegCmd := exec.Command("/bin/sh", "-c", transcoder)
	out, err := ffmpegCmd.CombinedOutput()
	if err != nil {
		log.Errorf("Error running FFMPEG transcode command, output: %v\n", string(out), err)
		return err
	}

	log.Infof("FFMPEG transcode output: %v\n", string(out))
	return nil
}

func uploadToS3(name string) error {
	dir := "/tmp/" + name
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		log.Error("Error getting files to upload to S3", err)
		return err
	}

	for _, fileInfo := range files {
		bucket := "scrim-vod"
		acl := "public-read"
		fileName := fileInfo.Name()
		key := fmt.Sprintf("%v/%v", name, fileName)

		file, err := os.Open(fmt.Sprintf("%v/%v", dir, fileName))
		defer file.Close()
		if err != nil {
			log.Error("Error opening file", err)
			return err
		}

		result, err := s3Uploader.Upload(&s3manager.UploadInput{
			Bucket: &bucket,
			Key:    &key,
			Body:   file,
			ACL:    &acl,
		})
		if err != nil {
			fmt.Println("Error uploading file to S3", err)
			return err
		}

		log.Infof("Uploaded %v file to S3 with result %v\n", key, result)
	}

	return nil
}

func cleanup(name string) {
	dir := "/tmp/" + name
	os.RemoveAll(dir)
	os.Remove(dir + ".mp4")
	log.Info("Cleaned up " + dir)
}
