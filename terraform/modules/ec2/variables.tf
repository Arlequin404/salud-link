variable "name" {
  description = "Nombre identificador del recurso"
  type        = string
}

variable "compose_file" {
  description = "Nombre del archivo docker-compose a ejecutar"
  type        = string
}

variable "public_ip" {
  description = "IP pública de la instancia EC2"
  type        = string
}

variable "private_key_path" {
  description = "Ruta del archivo .pem para la conexión SSH"
  type        = string
}

variable "subnet_id" {
  description = "ID de la subred en la que se lanzará la instancia"
  type        = string
}

variable "security_group_ids" {
  description = "Lista de security groups a asociar (si no se crea uno nuevo)"
  type        = list(string)
  default     = []
}

variable "create_security_group" {
  description = "Si se debe crear un nuevo Security Group"
  type        = bool
  default     = false
}

variable "associate_elastic_ip" {
  description = "Si se debe asociar una Elastic IP"
  type        = bool
  default     = false
}

variable "ami_id" {
  description = "ID de la AMI para lanzar la instancia EC2"
  type        = string
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
}

variable "key_name" {
  description = "Nombre de la clave pública configurada en AWS para acceso SSH"
  type        = string
}
