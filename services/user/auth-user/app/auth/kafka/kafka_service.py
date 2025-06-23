from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
import asyncio, json, uuid

loop = asyncio.get_event_loop()
producer = AIOKafkaProducer(bootstrap_servers='kafka:9092', loop=loop)

async def send_and_receive(topic: str, payload: dict):
    correlation_id = str(uuid.uuid4())
    reply_topic = "auth-user-response"

    await producer.start()
    try:
        await producer.send_and_wait(topic, json.dumps({
            "correlationId": correlation_id,
            "replyTo": reply_topic,
            "data": payload
        }).encode())

        consumer = AIOKafkaConsumer(
            reply_topic,
            bootstrap_servers='kafka:9092',
            loop=loop,
            group_id="auth-user-group"
        )
        await consumer.start()
        try:
            async for msg in consumer:
                data = json.loads(msg.value.decode())
                if data.get("correlationId") == correlation_id:
                    return data.get("data")
        finally:
            await consumer.stop()
    finally:
        await producer.stop()
