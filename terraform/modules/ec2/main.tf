resource "aws_instance" "this" {
  ami                         = var.ami_id
  instance_type               = var.instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = var.create_security_group ? [aws_security_group.this[0].id] : var.security_group_ids
  associate_public_ip_address = true
  key_name                    = var.key_name

  tags = {
    Name = var.name
  }

  provisioner "remote-exec" {
    inline = [
      "docker compose -f ${var.compose_file} pull",
      "docker compose -f ${var.compose_file} up -d"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file(var.private_key_path)
      host        = var.public_ip
    }
  }
}

resource "aws_security_group" "this" {
  count       = var.create_security_group ? 1 : 0
  name        = "sg-${replace(var.name, "_", "-" )}"
  description = "Allow SSH, HTTP, HTTPS, Custom Ports"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
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
