#! /bin/bash

yum -y --security update
yum -y update aws-cli
yum -y install awslogs jq

cd /tmp && \
    curl -kO https://www.johnvansickle.com/ffmpeg/builds/ffmpeg-git-64bit-static.tar.xz && \
    tar Jxf ffmpeg-git-64bit-static.tar.xz && \
    cd ffmpeg*/ && \
    cp ffmpeg /usr/local/bin && \
    cp qt-faststart /usr/local/bin

mkdir -p /var/lib/transcode
chmod -R 777 /var/lib/transcode

cd /home/ec2-user
cp transcode-worker.sh /var/lib/transcode/transcode-worker.sh
cp transcoder.sh /var/lib/transcode/transcoder.sh
chmod +x /var/lib/transcode/transcode-worker.sh
chmod +x /var/lib/transcode/transcoder.sh
nohup /home/ec2-user/scrim-transcoding &