# update-patient

**Business Domain:** Patient Management  
**Language:** Go (Golang)  
**Architecture:** REST Microservice, Clean Code, Docker  
**Database:** PostgreSQL

## Description

Updates patient data by ID.

## Requirements

- Go 1.21+
- Docker & Docker Compose
- PostgreSQL (service: `postgres-patient`)

## Environment Variables

Same as `create-patient`, but `PORT=8017`

## Run Locally

```bash
go run main.go
```

## Run with Docker

```bash
docker build -t update-patient .
docker run --env-file .env -p 8017:8017 update-patient
```

## API

- **PUT /api/patient/:id**
  - Body: `{ "cedula": "...", "name": "..." }`
  - Returns: success message
