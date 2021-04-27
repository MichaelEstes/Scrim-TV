#! /bin/bash
APP=scrim-api
VERSION=$(date +%s)
ENV=ScrimApi-PROD
S3_BUCKET=scrim-applications
S3_FNAME="${VERSION}_${APP}.zip"

env GOOS=linux GOARCH=amd64 go build
mv ${APP} application
zip -r ${S3_FNAME} application .ebextensions

aws s3 cp $S3_FNAME s3://${S3_BUCKET}
aws elasticbeanstalk create-application-version --application-name ${APP} --version-label ${VERSION} --source-bundle S3Bucket=${S3_BUCKET},S3Key=${S3_FNAME}
aws elasticbeanstalk update-environment --environment-name ${ENV} --version-label ${VERSION}

rm ${S3_FNAME}
rm application