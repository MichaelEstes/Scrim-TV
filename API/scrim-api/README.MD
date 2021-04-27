docker build -t scrim-api .
docker run --name scrim-api -it -p 8080:80 --rm scrim-api

docker build -t redis ./Dockerfiles/Redis
docker run --name redis -it -p 6379:6379 --rm redis

docker build -t mysql ./Dockerfiles/MySQL
docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -it --rm mysql
mysql --user=root --password
CREATE DATABASE SCRIM;
mysql --user=root --password SCRIM

Build and Deploy
env GOOS=linux GOARCH=amd64 go build
scp scrim-api ec2-user@127.0.0.1:~/
ssh ec2-user@127.0.0.1
sudo nohup ./scrim-api &
