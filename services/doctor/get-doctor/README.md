# Get-Doctor Microservice

**Path**: services/doctor/get-doctor

## Overview
Retrieves a single doctor by cedula.
Endpoint:
- GET /api/doctor/:cedula

## Architecture & Tech
- Express + Sequelize
- PostgreSQL (doctor_db)
- CORS for http://localhost:3000

## Business Domain
- Doctor profile lookup for editing.

## Design Style
- Route parameter mapping
- Error codes on miss

## Requirements & Run
```bash
docker compose build get-doctor
docker compose up -d get-doctor
```