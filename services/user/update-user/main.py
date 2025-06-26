from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid
import os
from dotenv import load_dotenv

# ✅ Cargar variables del archivo .env
load_dotenv()

DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cedula = Column(String(20), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20))
    birthdate = Column(String)
    gender = Column(String(1))
    city = Column(String(100))
    address = Column(String(255))
    role = Column(String(50))

app = FastAPI()

class UserUpdate(BaseModel):
    name: str = None
    password: str = None
    phone: str = None
    birthdate: str = None
    gender: str = None
    city: str = None
    address: str = None
    role: str = None

@app.put("/users/{user_id}")
def update_user(user_id: str, user_update: UserUpdate):
    db = SessionLocal()
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    db.close()
    return {"message": "User updated successfully", "user_id": str(user.id)}
