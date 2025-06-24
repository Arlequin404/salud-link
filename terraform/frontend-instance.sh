#!/bin/bash
yum update -y
yum install -y docker git
service docker start
usermod -a -G docker ec2-user
cd /home/ec2-user
git clone https://github.com/TU_USUARIO/REPO_FRONTEND.git frontend
cd frontend
docker compose -f docker-compose.frontend.yml up -d