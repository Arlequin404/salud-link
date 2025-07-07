# Create-User Microservice

**Path**: `services/user/create-user`

## Overview  
Handles creation of users in the **User** domain.  
Exposes:
- `POST /users` to create a new user in `user_db`.
- If `role=doctor`, replicates doctor info to the Doctor domain.

## Architecture & Tech  
- **Framework**: FastAPI  
- **ORM**: SQLAlchemy  
- **DB**: PostgreSQL (`user_db`)  
- **Comm**: HTTP REST  

## Business Domain  
- Core user onboarding.  
- Triggers downstream doctor‐replication when needed.

## Design Style  
- **Layered**: routers → models → main  
- **Transaction‐safe**: commits only on success  
- **Stateless**: no in-memory caches

## Requirements  
- Python >= 3.10  
- PostgreSQL 15  
- Docker & Docker Compose (optional)  
- Environment variables in `.env`:
  - `POSTGRES_HOST`, `POSTGRES_PORT`
  - `POSTGRES_DB=user_db`
  - `POSTGRES_USER`, `POSTGRES_PASSWORD`
  - `PORT` (default: `8000`)

## Running & Deployment

### Docker Compose  
```bash
# From repo root
docker compose build create-user
docker compose up -d create-user
