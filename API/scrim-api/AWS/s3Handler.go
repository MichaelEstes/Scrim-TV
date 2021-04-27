package handleaws

import (
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	log "github.com/sirupsen/logrus"
)

var (
	s3Downloader *s3manager.Downloader
	s3Uploader   *s3manager.Uploader
)

//InitS3 establish AWS sessions and S3 APIs
func InitS3() {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("us-east-2")},
	)
	if err != nil {
		panic("Can't get AWS session, killing process")
	}

	s3Downloader = s3manager.NewDownloader(sess)
	s3Uploader = s3manager.NewUploader(sess)

	log.Info("Sucessfully created AWS session")
}

//UploadVideoToS3 upload video to S3
func UploadVideoToS3(fileName string, file io.Reader) (string, error) {
	bucket := "ingestion"
	key := fileName
	acl := "bucket-owner-full-control"
	contentType := "video/*"

	result, err := s3Uploader.Upload(&s3manager.UploadInput{
		Bucket:      &bucket,
		Key:         &key,
		Body:        file,
		ACL:         &acl,
		ContentType: &contentType,
	})
	if err != nil {
		fmt.Println("Error uploading video to S3", err)
		return "", err
	}

	log.Infof("Uploaded %v file to S3 with result %v\n", key, result)
	return result.Location, nil
}

//UploadThumbnailToS3 upload thumbnail for broadcast to S3
func UploadThumbnailToS3(fileName string, file io.Reader) (string, error) {
	bucket := "thumbnails"
	acl := "public-read"
	key := fmt.Sprintf("video/%v", fileName)
	contentType := "image/*"

	result, err := s3Uploader.Upload(&s3manager.UploadInput{
		Bucket:      &bucket,
		Key:         &key,
		Body:        file,
		ACL:         &acl,
		ContentType: &contentType,
	})
	if err != nil {
		fmt.Println("Error uploading file to S3", err)
		return "", err
	}

	log.Infof("Uploaded %v file to S3 with result %v\n", key, result)
	return result.Location, nil
}

//Upload a user's profile picture to S3
func UploadProfilePictureToS3(fileName string, file io.Reader) (string, error) {
	bucket := "thumbnails"
	acl := "public-read"
	key := fmt.Sprintf("profile/%v", fileName)
	contentType := "image/*"

	result, err := s3Uploader.Upload(&s3manager.UploadInput{
		Bucket:      &bucket,
		Key:         &key,
		Body:        file,
		ACL:         &acl,
		ContentType: &contentType,
	})
	if err != nil {
		fmt.Println("Error uploading file to S3", err)
		return "", err
	}

	log.Infof("Uploaded %v file to S3 with result %v\n", key, result)
	return result.Location, nil
}
