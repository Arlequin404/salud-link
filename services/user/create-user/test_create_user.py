import pytest
from httpx import AsyncClient
from app.main import app
from asgi_lifespan import LifespanManager
from httpx import ASGITransport

@pytest.mark.asyncio
async def test_create_user_success():
    async with LifespanManager(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            payload = {
                "cedula": "1234567899",
                "name": "Test User",
                "email": "test1@example.com",
                "password": "secret123",
                "phone": "0999999998",
                "birthdate": "2000-01-01",
                "gender": "male",
                "city": "Quito",
                "address": "Somewhere 123",
                "role": "user"
            }
            response = await client.post("/create-user", json=payload)
            assert response.status_code in (200, 201)
            assert response.json() == {"message": "User created successfully"}
