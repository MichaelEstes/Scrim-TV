Run locally:

- stop nginx: sudo nginx -s stop
- start nginx: sudo nginx -c /Users/schen/go/src/bitbucket.org/scrim-ingestion/nginx.conf
- reload nginx: sudo nginx -s reload

To Run on Server

- run build.sh
- scp -i ~/.ssh/SCRIM_KEY_PAIR.pem application.zip ec2-user@{SERVER IP}:~/
- ssh -i ~/.ssh/SCRIM_KEY_PAIR.pem ec2-user@{SERVER IP}
- run unzip application.zip
- run sudo chmod +x init.sh
- run sudo ./init.sh

To Run on Docker

- docker build -t scrim-ingestion .
- docker run --name scrim-ingestion -it -p 1935:1935 -p 8080:8080 --rm scrim-ingestion
- docker run --name scrim-ingestion -it -p 1935:1935 -p 5000:5000 --rm scrim-ingestion
- docker exec -it \$(docker ps -aqf "name=scrim-ingestion") bash
