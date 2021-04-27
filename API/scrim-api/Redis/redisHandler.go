package handleredis

import (
	"github.com/go-redis/redis"
	log "github.com/sirupsen/logrus"
)

var client *redis.Client

//ConnectRedis establish connection with redis
func ConnectRedis() {
	client = redis.NewClient(&redis.Options{
		Addr:     "localhost:10194",
		Password: "password",
		DB:       0,
	})

	pong, err := client.Ping().Result()
	if err != nil {
		log.Error("Error connecting to Redis", err)
	}

	log.Infof("Pinged Redis with response %v", pong)
}

//GetClient get Redis client
func GetClient() *redis.Client {
	return client
}
