
# Auth User Microservice

## 🧩 Description

This microservice is part of the **User Domain** in the Salud-Link project. It implements a MVC + JWT Auth and is responsible for authenticating users and issuing JWT tokens..

## 🛠 Tech Stack & Libraries

- **Language**: Python (FastAPI)
- **Architecture**: MVC + JWT Auth
- **Communication**: REST API
- **Database**: PostgreSQL (per domain)
- **Other Tools**: 
  - `databases` for async DB access
  - `asyncpg` as PostgreSQL driver
  - `python-dotenv` for env management
  - `jose` for JWT encoding/decoding

## 📁 Folder Structure

```
app/
├── auth/
│   ├── controller.py
│   ├── service.py
│   └── schemas.py
├── database/
│   └── connection.py
├── kafka/
│   ├── producer.py
│   └── consumer.py
├── main.py
├── Dockerfile
├── requirements.txt
```

## 🚀 How to Run

```bash
# 1. Build and run via Docker Compose
docker-compose up --build auth-user

# 2. Or run manually (for development)
cd services/user/auth-user
uvicorn app.main:app --reload --port 3000
```

## ⚙️ Environment Variables

Define a `.env` file with:

```
POSTGRES_URL=postgresql://admin:admin123@create-user-db:5432/create_user_db
KAFKA_BROKER=kafka:9092
JWT_SECRET=your-secret
```

## 📬 API Endpoints

- `POST /auth/login` — Authenticate user and return JWT.

## ✅ Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run app
uvicorn app.main:app --reload

# Run tests (if any)
pytest
```

## 🧪 Testing

Unit and integration tests should be placed under `tests/` with pytest framework.
