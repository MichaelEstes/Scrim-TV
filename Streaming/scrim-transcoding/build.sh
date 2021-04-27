#! /bin/bash
env GOOS=linux GOARCH=amd64 go build
zip application.zip init.sh transcoder.sh transcode-worker.sh scrim-transcoding