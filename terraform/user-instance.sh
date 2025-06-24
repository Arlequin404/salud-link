#!/bin/bash
yum update -y
yum install -y docker git
service docker start
usermod -a -G docker ec2-user
cd /home/ec2-user
git clone https://github.com/TU_USUARIO/REPO_USER.git user
cd user
docker compose -f docker-compose.user.yml up -d