output "user_instance_ip" {
  value = aws_instance.user_instance.public_ip
}

output "frontend_instance_ip" {
  value = aws_instance.frontend_instance.public_ip
}

output "infra_instance_ip" {
  value = aws_instance.infra_instance.public_ip
}