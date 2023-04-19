# initialize
docker volume create portainer_data
docker run -d -p 9000:9000 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:2.16.0
docker network create bkchat

# start db
# start imgproxy
# start fe
# start node
# start flask
# start nginx

# cd ./db
# docker compose up -d
# cd ../cicd/
# docker compose up -d
# cd ../nginx/
# docker compose up -d
# Kafka
# docker network create kafka
# docker run -d --name zookeeper-server --network kafka zookeeper:3.8-temurin
# docker run -d --name kafka-server -e TZ=UTC -p 9092:9092 -e ZOOKEEPER_HOST=zookeeper-server --network kafka ubuntu/kafka:3.1-22.04_beta
# docker run -p 8001:8080 --name kafka-ui -e KAFKA_CLUSTERS_0_NAME=local -e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka-server:9092 --network kafka -d provectuslabs/kafka-ui:latest
# Redis (username default)
# docker volume create redis_data
# docker run -d --network database -e REDIS_PASSWORD=admin12345 -v redis_data:/data -p 6379:6379 --name redis --restart always redis /bin/sh -c 'redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}'
# Jenkins
# docker network create cicd
# docker run -u 0 -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):$(which docker) -v /data/jenkins_data:/var/jenkins_home -p 8080:8080  --name jenkins --network cicd -d jenkins/jenkins:lts-jdk11


