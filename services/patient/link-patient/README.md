# link-patient

**Business Domain:** Patient Management  
**Language:** Go (Golang)  
**Architecture:** REST Microservice, Clean Code, Docker  
**Database:** PostgreSQL

## Description

Links an existing patient to a new user by updating the `user_id`.

## Requirements

- Go 1.21+
- Docker & Docker Compose
- PostgreSQL (service: `postgres-patient`)

## Environment Variables

Same as `create-patient`, but `PORT=8019`

## Run Locally

```bash
go run main.go
```

## Run with Docker

```bash
docker build -t link-patient .
docker run --env-file .env -p 8019:8019 link-patient
```

## API

- **POST /api/patient/link**
  - Body: `{ "patient_id": "...", "user_id": "..." }`
  - Returns: success message
