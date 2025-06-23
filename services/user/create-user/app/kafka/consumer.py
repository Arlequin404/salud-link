# app/kafka/consumer.py

import json
import logging
from aiokafka import AIOKafkaConsumer
from sqlalchemy import select
from app.database import database
from app.models import users
import asyncio
import os

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")
TOPIC = os.getenv("KAFKA_REQUEST_TOPIC", "search-user")
GROUP_ID = os.getenv("KAFKA_GROUP_ID", "create-user-group")

async def consume():
    """
    Starts the Kafka consumer that listens for user search requests.
    Expects messages containing an 'email' inside the 'data' field.
    Logs whether the user exists or not in the database.
    """
    loop = asyncio.get_event_loop()

    consumer = AIOKafkaConsumer(
        TOPIC,
        bootstrap_servers=KAFKA_BROKER,
        group_id=GROUP_ID,
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        loop=loop,
        auto_offset_reset="earliest"
    )

    await consumer.start()
    try:
        async for msg in consumer:
            payload = msg.value
            logger.info(f"📥 Received message on topic {TOPIC}: {payload}")

            # Extract the email from the nested 'data' field
            email = payload.get("data", {}).get("email")
            if not email:
                logger.warning("❗ Email not provided in payload")
                continue

            # Search for user by email
            query = select(users).where(users.c.email == email)
            result = await database.fetch_one(query)

            logger.info(f"🔎 Email '{email}' {'exists' if result else 'does not exist'}")

    finally:
        await consumer.stop()
