# services/user/create-user/app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # ← IMPORTANTE
from pydantic import BaseModel, EmailStr, constr
from uuid import uuid4
from datetime import date
from sqlalchemy import insert, select, create_engine
from passlib.context import CryptContext
from app.database import metadata, database
from app.models import users
from app.kafka.producer import send_message
from aiokafka import AIOKafkaConsumer
from loguru import logger
import asyncio
import json

# --- App initialization ---
app = FastAPI(
    title="Create User Microservice",
    description="Service for creating and validating users",
    version="1.0.0"
)

# --- Habilitar CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia a ["http://localhost:8080"] si deseas restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Pydantic Schema ---
class UserCreate(BaseModel):
    cedula: constr(min_length=10, max_length=10)
    name: constr(min_length=1)
    email: EmailStr
    password: constr(min_length=5)
    phone: str
    birthdate: date
    gender: str
    city: str
    address: str
    role: str

# --- Kafka config ---
KAFKA_BROKER = "kafka:9092"
KAFKA_TOPIC_REQUEST = "search-user"
KAFKA_TOPIC_SYNC = "auth-user-sync"
KAFKA_TOPIC_UPDATE = "user.updated"
KAFKA_GROUP = "create-user-group"

# --- Kafka consumer logic ---
async def consume():
    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC_REQUEST,
        bootstrap_servers=KAFKA_BROKER,
        group_id=KAFKA_GROUP,
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        auto_offset_reset="earliest"
    )
    await consumer.start()
    logger.info("✅ Kafka consumer started")

    try:
        async for msg in consumer:
            payload = msg.value
            logger.info(f"📥 Received message on {KAFKA_TOPIC_REQUEST}: {payload}")

            correlation_id = payload.get("correlationId")
            reply_to = payload.get("replyTo")
            email = payload.get("data", {}).get("email")

            if not (correlation_id and reply_to and email):
                logger.warning("❗ Missing fields in Kafka message")
                continue

            query = select(users).where(users.c.email == email)
            user = await database.fetch_one(query)

            response = {
                "correlationId": correlation_id,
                "data": dict(user) if user else None
            }

            await send_message(reply_to, response)
            logger.info(f"📤 Sent response to {reply_to}: {response}")

    except Exception as e:
        logger.error(f"❌ Kafka consumer error: {e}")
    finally:
        await consumer.stop()
        logger.info("🛑 Kafka consumer stopped")

# --- Startup / Shutdown events ---
@app.on_event("startup")
async def startup():
    await database.connect()
    engine = create_engine(str(database.url))
    metadata.create_all(engine)

    # Iniciar consumidor Kafka
    asyncio.create_task(consume())

    # 🔁 Reenviar todos los usuarios al topic de sincronización
    users_data = await database.fetch_all(select(users))
    for user in users_data:
        await send_message(KAFKA_TOPIC_SYNC, dict(user))
    logger.info("🔁 All users resent to auth-user-sync on startup.")

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# --- API Endpoint ---
@app.post("/create-user", status_code=201)
async def create_user(user: UserCreate) -> dict:
    query = select(users).where(users.c.email == user.email)
    if await database.fetch_one(query):
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user.password)
    user_id = str(uuid4())

    insert_query = insert(users).values(
        id=user_id,
        cedula=user.cedula,
        name=user.name,
        email=user.email,
        password=hashed_password,
        phone=user.phone,
        birthdate=user.birthdate,
        gender=user.gender,
        city=user.city,
        address=user.address,
        role=user.role,
        is_active=True
    )

    await database.execute(insert_query)

    user_data = {
        "id": user_id,
        "cedula": user.cedula,
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "phone": user.phone,
        "birthdate": str(user.birthdate),
        "gender": user.gender,
        "city": user.city,
        "address": user.address,
        "role": user.role,
        "is_active": True
    }

    await send_message(KAFKA_TOPIC_SYNC, user_data)
    await send_message(KAFKA_TOPIC_UPDATE, user_data)
    logger.info(f"📤 Sent user data to {KAFKA_TOPIC_SYNC} and {KAFKA_TOPIC_UPDATE}")

    return {"message": "User created and propagated successfully"}
