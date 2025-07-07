# Delete-Doctor Microservice

**Path**: services/doctor/delete-doctor

## Overview
Deletes doctor and replica.
Endpoint:
- DELETE /api/doctor/:cedula

## Architecture & Tech
- Express + Sequelize
- PostgreSQL (doctor_db)
- CORS for http://localhost:3000

## Business Domain
- Doctor offboarding and cleanup.

## Design Style
- Cascading deletes within a DB transaction

## Requirements & Run
```bash
docker compose build delete-doctor
docker compose up -d delete-doctor
```