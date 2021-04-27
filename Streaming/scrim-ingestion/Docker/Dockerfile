FROM tiangolo/nginx-rtmp
COPY nginx.conf /etc/nginx/nginx.conf

RUN cd /tmp && \
    curl -kO https://www.johnvansickle.com/ffmpeg/builds/ffmpeg-git-64bit-static.tar.xz && \
    tar Jxf ffmpeg-git-64bit-static.tar.xz && \
    cd ffmpeg*/ && \
    cp ffmpeg /usr/local/bin && \
    cp qt-faststart /usr/local/bin

RUN apt-get update && \
    apt-get install -y \
    python3 \
    python3-pip \
    python3-setuptools \
    groff \
    less \
    && pip3 install --upgrade pip \
    && apt-get clean
RUN pip3 --no-cache-dir install --upgrade awscli

RUN mkdir -p /var/lib/nginx/hls
RUN mkdir -p /var/lib/nginx/rec
RUN mkdir -p /var/lib/nginx/vod
RUN chmod -R 777 /var/lib/nginx

COPY postprocess.sh /var/lib/nginx/postprocess.sh
RUN chmod +x /var/lib/nginx/postprocess.sh

EXPOSE 1935
EXPOSE 80