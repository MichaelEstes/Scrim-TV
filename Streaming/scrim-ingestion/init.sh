#! /bin/bash
yum -y --security update
yum -y update aws-cli
yum install git gcc make pcre-devel openssl-devel zlib1g-dev

cd /tmp && \
    curl -kO https://www.johnvansickle.com/ffmpeg/builds/ffmpeg-git-64bit-static.tar.xz && \
    tar Jxf ffmpeg-git-64bit-static.tar.xz && \
    cd ffmpeg*/ && \
    cp ffmpeg /usr/local/bin && \
    cp qt-faststart /usr/local/bin

cd /tmp && \
  mkdir nginx && \ 
  cd nginx

git clone git://github.com/arut/nginx-rtmp-module.git

wget http://nginx.org/download/nginx-1.14.1.tar.gz && \
  tar xzf nginx-1.14.1.tar.gz && \
  cd nginx-1.14.1

./configure --with-http_ssl_module --add-module=../nginx-rtmp-module
make
make install

mkdir -p /var/lib/nginx/hls
mkdir -p /var/lib/nginx/rec
mkdir -p /var/lib/nginx/vod
chmod -R 777 /var/lib/nginx

cd /home/ec2-user
cp postprocess.sh /var/lib/nginx/postprocess.sh
chmod +x /var/lib/nginx/postprocess.sh

cd /home/ec2-user
cp nginx.conf /usr/local/nginx/conf/nginx.conf
/usr/local/nginx/sbin/nginx