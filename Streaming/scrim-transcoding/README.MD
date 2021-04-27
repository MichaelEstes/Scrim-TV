Worker that reads from SQS event notification whenever a video is copied to S3

To Run on Server:

- run build.sh
- scp -i ~/.ssh/SCRIM_KEY_PAIR.pem application.zip ec2-user@{SERVER IP}:~/
- ssh -i ~/.ssh/SCRIM_KEY_PAIR.pem ec2-user@{SERVER IP}
- run unzip application.zip
- run sudo chmod +x init.sh
- run sudo ./init.sh

scp -i ~/.ssh/SCRIM_KEY_PAIR.pem application.zip ec2-user@1127.0.0.1:~/
