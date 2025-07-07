# get-patient

**Business Domain:** Patient Management  
**Language:** Go (Golang)  
**Architecture:** REST Microservice, Clean Code, Docker  
**Database:** PostgreSQL

## Description

Retrieves a patient's information by ID from the `patient_db`.

## Requirements

- Go 1.21+
- Docker & Docker Compose
- PostgreSQL (service: `postgres-patient`)

## Environment Variables

Same as `create-patient`, but `PORT=8016`

## Run Locally

```bash
go run main.go
```

## Run with Docker

```bash
docker build -t get-patient .
docker run --env-file .env -p 8016:8016 get-patient
```

## API

- **GET /api/patient/:id**
  - URL param: `id` (uuid)
  - Returns: patient JSON object
