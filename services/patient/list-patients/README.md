# list-patients

**Business Domain:** Patient Management  
**Language:** Go (Golang)  
**Architecture:** REST Microservice, Clean Code, Docker  
**Database:** PostgreSQL

## Description

Lists all patients registered in the database.

## Requirements

- Go 1.21+
- Docker & Docker Compose
- PostgreSQL (service: `postgres-patient`)

## Environment Variables

Same as `create-patient`, but `PORT=8015`

## Run Locally

```bash
go run main.go
```

## Run with Docker

```bash
docker build -t list-patients .
docker run --env-file .env -p 8015:8015 list-patients
```

## API

- **GET /api/patients**
  - Returns: Array of patients
