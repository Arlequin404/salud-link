# create-user

Microservicio del dominio `user`.# Create User Microservice

This microservice is part of the **Salud-Link** system. It handles user registration operations with validation and password hashing, and stores user data in a dedicated PostgreSQL database.

## 🧱 Tech Stack

- **FastAPI** (Python 3.12)
- **PostgreSQL** 15
- **Docker** & **Docker Compose**
- **Kafka** (Bitnami image)
- **Zookeeper**
- **SQLAlchemy**, **Databases**, **Passlib**

---

## 📦 Project Structure

```
services/
└── user/
    └── create-user/
        ├── app/
        │   ├── __init__.py
        │   ├── main.py
        │   ├── models.py
        │   ├── database.py
        │   └── wait-for-it.sh
        ├── requirements.txt
        ├── Dockerfile
        └── .env
docker-compose.yml
```

---

## ⚙️ Environment Variables

Inside `./services/user/create-user/.env`:

```
DATABASE_URL=postgresql://admin:admin123@create-user-db:5432/postgres
```

---

## 🚀 Installation & Running

### Prerequisites

- Docker
- Docker Compose

### Commands

1. **Clone the repository**:

```bash
git clone <your_repo_url> salud-link
cd salud-link
```

2. **Build and start containers**:

```bash
docker-compose down -v
docker-compose up --build
```

3. **Access the API Docs**:

Visit: [http://localhost:8081/docs](http://localhost:8081/docs)

---

## 📮 Sample Payload

**POST** `/create-user`

```json
{
  "cedula": "1234567890",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePass123",
  "phone": "0999999999",
  "birthdate": "2000-01-01",
  "gender": "female",
  "city": "Quito",
  "address": "Av. Amazonas y NNUU",
  "role": "user"
}
```

---

## 🐘 Database

PostgreSQL runs on port `5434` locally. Data is stored in the `postgres` database.

```bash
psql -h localhost -p 5434 -U admin -d postgres
```

---

## 🔐 Notes

- Passwords are securely hashed using bcrypt.
- Microservice follows clean separation of concerns.
- Ready to integrate with Kafka for data propagation.

---

## 📡 Health Check

Use:

```bash
curl http://localhost:8081/docs
```

Or test the `/create-user` route with Postman or curl.

---

## 🧪 Testing (Manual)

Use Swagger or send requests via Postman:

```bash
curl -X POST http://localhost:8081/create-user -H "Content-Type: application/json" -d '{"cedula":"1234567890","name":"Jane","email":"jane@example.com","password":"abc12345","phone":"0999999999","birthdate":"2000-01-01","gender":"F","city":"Quito","address":"Calle 123","role":"user"}'
```

---

## 📄 License

MIT