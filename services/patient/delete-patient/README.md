# delete-patient

**Business Domain:** Patient Management  
**Language:** Go (Golang)  
**Architecture:** REST Microservice, Clean Code, Docker  
**Database:** PostgreSQL

## Description

Deletes a patient by `id`. Receives a DELETE request and removes the patient from the PostgreSQL `patient_db`.

## Requirements

- Go 1.21+
- Docker & Docker Compose
- PostgreSQL (service: `postgres-patient`)

## Environment Variables

Same as `create-patient`

## Run Locally

```bash
go run main.go
```

## Run with Docker

```bash
docker build -t delete-patient .
docker run --env-file .env -p 8018:8018 delete-patient
```

## API

- **DELETE /api/patient/:id**
  - URL param: `id` (uuid)
  - Returns: success message
