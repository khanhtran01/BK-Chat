# Node 16 install on Ubuntu
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - &&\
apt-get install -y nodejs
docker run -dp 7474:7474 -p 7687:7687 neo4j:community
docker run -d -p 9000:9000 -p 9090:9090 --user $(id -u):$(id -g) --name minio -e "MINIO_ROOT_USER=ROOTUSER" -e "MINIO_ROOT_PASSWORD=CHANGEME123" -v /home/ubuntu/deploy/minio/data:/data quay.io/minio/minio server /data --console-address ":9090"