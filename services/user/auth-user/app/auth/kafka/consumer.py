# auth-user/app/auth/kafka/consumer.py
import json
from datetime import date
from aiokafka import AIOKafkaConsumer
from app.database import database
from app.models import users
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.sql import func
from loguru import logger

KAFKA_BROKER = "kafka:9092"
KAFKA_TOPIC = "auth-user-sync"
KAFKA_GROUP = "auth-user-group"

async def consume_kafka_messages():
    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=KAFKA_BROKER,
        group_id=KAFKA_GROUP,
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        auto_offset_reset="earliest"
    )

    await consumer.start()
    logger.info("✅ Kafka consumer started for auth-user")

    try:
        async for msg in consumer:
            data = msg.value
            logger.info(f"📥 Received user sync data: {data}")

            # Convertir fecha de nacimiento a objeto date si es string
            if isinstance(data.get("birthdate"), str):
                data["birthdate"] = date.fromisoformat(data["birthdate"])

            query = pg_insert(users).values(**data).on_conflict_do_update(
                index_elements=["id"],
                set_={
                    "name": data["name"],
                    "email": data["email"],
                    "password": data["password"],
                    "phone": data["phone"],
                    "birthdate": data["birthdate"],
                    "gender": data["gender"],
                    "city": data["city"],
                    "address": data["address"],
                    "role": data["role"],
                    "is_active": data.get("is_active", True),
                    "updated_at": func.now()
                }
            )

            await database.execute(query)
            logger.info(f"✅ User {data['id']} inserted or updated in auth-user DB")

    except Exception as e:
        logger.error(f"❌ Kafka error in auth-user: {e}")
    finally:
        await consumer.stop()
        logger.info("🛑 Kafka consumer stopped")
