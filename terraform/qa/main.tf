module "infra" {
  source                 = "../modules/ec2"
  public_ip              = "13.216.69.108"
  private_key_path       = var.private_key_path
  compose_file           = "docker-compose.infra.yml"
  create_security_group  = true
  associate_elastic_ip   = true
}

module "user" {
  source                 = "../modules/ec2"
  public_ip              = "54.82.74.94"
  private_key_path       = var.private_key_path
  compose_file           = "docker-compose.user.yml"
  create_security_group  = true
  associate_elastic_ip   = true
}

module "frontend" {
  source                 = "../modules/ec2"
  public_ip              = "54.236.175.72"
  private_key_path       = var.private_key_path
  compose_file           = "docker-compose.frontend.yml"
  create_security_group  = true
  associate_elastic_ip   = true
}
