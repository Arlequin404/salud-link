provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "user_instance" {
  ami                    = "ami-0c55b159cbfafe1f0"
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.sg.id]
  user_data              = file("user-instance.sh")
  tags = {
    Name = "User Services Instance"
  }
}

resource "aws_instance" "frontend_instance" {
  ami                    = "ami-0c55b159cbfafe1f0"
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.sg.id]
  user_data              = file("frontend-instance.sh")
  tags = {
    Name = "Frontend Instance"
  }
}

resource "aws_instance" "infra_instance" {
  ami                    = "ami-0c55b159cbfafe1f0"
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.sg.id]
  user_data              = file("infra-instance.sh")
  tags = {
    Name = "Infra Instance"
  }
}

resource "aws_security_group" "sg" {
  name        = "saludlink-sg"
  description = "Allow all traffic for development"

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}