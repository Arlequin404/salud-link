provider "aws" {
  region = "us-east-1"
}


# Infra Instance
resource "aws_instance" "infra_instance" {
  ami                    = "ami-05c13eab67c5d8861"
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = ["sg-0c2fa0825e341aa46"] # ✅ grupo existente
  user_data              = file("${path.module}/infra-instance.sh")

  tags = {
    Name = "Infra Instance"
  }
}

# User Instance
resource "aws_instance" "user_instance" {
  ami                    = "ami-05c13eab67c5d8861"
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = ["sg-0c2fa0825e341aa46"] # ✅ grupo existente
  user_data              = file("${path.module}/user-instance.sh")

  tags = {
    Name = "User Services Instance"
  }
}

# Frontend Instance
resource "aws_instance" "frontend_instance" {
  ami                    = "ami-05c13eab67c5d8861"
  instance_type          = "t2.micro"
  key_name               = var.key_name
  vpc_security_group_ids = ["sg-0c2fa0825e341aa46"] # ✅ grupo existente
  user_data              = file("${path.module}/frontend-instance.sh")

  tags = {
    Name = "Frontend Instance"
  }
}
