# List-Doctors Microservice

**Path**: services/doctor/list-doctors

## Overview
Lists all doctors.
Endpoint:
- GET /api/doctors

## Architecture & Tech
- Express + Sequelize
- PostgreSQL (doctor_db)
- CORS for http://localhost:3000

## Business Domain
- Read-only view of doctor directory.

## Design Style
- Simple REST: single route
- No data mutation

## Requirements & Run
```bash
docker compose build list-doctors
docker compose up -d list-doctors
```
or locally:
```bash
cd services/doctor/list-doctors
npm install
node index.js
```