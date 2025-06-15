from fastapi.testclient import TestClient
from main import app, User
import uuid

client = TestClient(app)

def test_create_and_get_user():
    user_id = str(uuid.uuid4())
    data = {"id": user_id, "name": "Juan Perez", "role": "paciente"}
    response = client.post("/users", json=data)
    assert response.status_code == 201

    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Juan Perez"
