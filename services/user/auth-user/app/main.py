from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 🔥 Añade esto
from app.auth import controller
from app.database import database
from app.auth.kafka.consumer import consume_kafka_messages
from app.models import metadata
from sqlalchemy import create_engine
import asyncio

app = FastAPI()

# 🔐 Permitir solicitudes del frontend (vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await database.connect()

    # Crear las tablas si no existen
    engine = create_engine(str(database.url))
    metadata.create_all(engine)

    asyncio.create_task(consume_kafka_messages())

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(controller.router)
