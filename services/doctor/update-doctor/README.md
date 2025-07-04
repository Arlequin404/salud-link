# Update-Doctor Microservice

**Path**: services/doctor/update-doctor

## Overview
Updates doctor records.
Endpoint:
- PUT /api/doctor/:cedula

## Architecture & Tech
- Express + Sequelize
- PostgreSQL (doctor_db)
- CORS for http://localhost:3000

## Business Domain
- Doctor profile edits & replica sync.

## Design Style
- Field whitelist for updates
- Transactional

## Requirements & Run
```bash
docker compose build update-doctor
docker compose up -d update-doctor
```