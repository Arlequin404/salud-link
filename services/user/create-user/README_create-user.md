
# Create User Microservice

## 🧩 Description

This microservice is part of the **User Domain** in the Salud-Link project. It implements a Repository Pattern and is responsible for registering new users and broadcasting user creation events..

## 🛠 Tech Stack & Libraries

- **Language**: Python (FastAPI)
- **Architecture**: Repository Pattern
- **Communication**: REST API
- **Database**: PostgreSQL (per domain)
- **Other Tools**: 
  - `databases` for async DB access
  - `asyncpg` as PostgreSQL driver
  - `python-dotenv` for env management
  - `jose` for JWT encoding/decoding

```


## 🚀 How to Run

```bash
# 1. Build and run via Docker Compose
docker-compose up --build create-user

# 2. Or run manually (for development)
cd services/user/create-user
uvicorn app.main:app --reload --port 8081
```

## ⚙️ Environment Variables

Define a `.env` file with:

```
POSTGRES_URL=postgresql://admin:admin123@create-user-db:5432/create_user_db
KAFKA_BROKER=kafka:9092
JWT_SECRET=your-secret
```

## 📬 API Endpoints

- `POST /create-user` — Create a new user and publish to Kafka.

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
