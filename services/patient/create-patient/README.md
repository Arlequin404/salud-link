# create-patient

**Business Domain:** Patient Management  
**Language:** Go (Golang)  
**Architecture:** REST Microservice, Clean Code, Docker  
**Database:** PostgreSQL  
**Pattern:** Single Responsibility Microservice

## Description

This microservice handles the creation of a new patient in the system. It receives patient data via a REST API and persists it in the `patient_db` PostgreSQL database. Each patient is linked by `user_id` to the user microservice.

## Requirements

- Go 1.21+
- Docker & Docker Compose
- PostgreSQL (service: `postgres-patient`)

## Environment Variables

Edit the `.env` file:

```
POSTGRES_HOST=postgres-patient
POSTGRES_PORT=5432
POSTGRES_DB=patient_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
PORT=8014
```

## Run Locally

```bash
go mod tidy
go run main.go
```

## Run with Docker

```bash
docker build -t create-patient .
docker run --env-file .env -p 8014:8014 create-patient
```

## API

- **POST /api/patient**
  - Body: `{ "user_id": "...", "cedula": "...", "name": "..." }`
  - Returns: `patient_id`
