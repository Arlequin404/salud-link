# services/user/create-user/app/kafka/producer.py

from aiokafka import AIOKafkaProducer
import json
import asyncio
from loguru import logger
import os

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")

producer: AIOKafkaProducer | None = None

async def get_producer() -> AIOKafkaProducer:
    global producer
    if not producer:
        try:
            producer = AIOKafkaProducer(
                bootstrap_servers=KAFKA_BROKER,
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            )
            await producer.start()
            logger.info("🚀 Kafka producer started")
        except Exception as e:
            logger.error(f"❌ Failed to start Kafka producer: {e}")
            raise
    return producer

async def send_message(topic: str, message: dict):
    try:
        prod = await get_producer()
        await prod.send_and_wait(topic, message)
        logger.info(f"📤 Message sent to {topic}: {message}")
    except Exception as e:
        logger.error(f"❌ Error sending message to {topic}: {e}")
