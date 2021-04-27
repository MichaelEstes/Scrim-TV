FROM golang:1.8 as scrim-api
EXPOSE 8080
WORKDIR /app
ENV SRC_DIR=/go/src/github.com/scrim-api
ADD . $SRC_DIR
RUN cd $SRC_DIR; go build -o scrim-api; cp scrim-api /app/
CMD ["./scrim-api"]
