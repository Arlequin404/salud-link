#!/bin/bash
yum update -y
yum install -y docker git
service docker start
usermod -a -G docker ec2-user
cd /home/ec2-user
git clone https://github.com/TU_USUARIO/REPO_INFRA.git infra
cd infra
docker compose -f docker-compose.infra.yml up -d