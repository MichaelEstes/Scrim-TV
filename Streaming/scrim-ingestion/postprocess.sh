#!/bin/bash

# Shut down gracefully
on_die ()
{
  pkill -KILL -P $$
}
trap 'on_die' TERM

# Redirect all output for CW Logs
FILE="/var/lib/nginx/output"
touch $FILE
exec 1> $FILE 2>&1

S3BUCKET="ingestion"
S3FOLDER="/var/lib/nginx/vod"
INPUTFILE="$1"
DESTFILE="$2.mp4"

# Transcode
mkdir -p $S3FOLDER
/usr/local/bin/ffmpeg -i $INPUTFILE -codec copy $S3FOLDER/$DESTFILE

# Upload to S3 - and make sure owner has access to the file!
aws s3 cp $S3FOLDER/$DESTFILE s3://$S3BUCKET/$DESTFILE --acl bucket-owner-full-control

# clean up
# rm -rf $S3FOLDER/$DESTFILE