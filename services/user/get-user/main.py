from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import uuid
import os
import jwt
from typing import List, Optional
from datetime import date

# Configuración base
DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
security = HTTPBearer()

# Modelo de base de datos
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

# App y CORS
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Esquema de respuesta
class UserResponse(BaseModel):
    id: uuid.UUID
    cedula: str
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True  # para Pydantic v2 (antes: orm_mode = True)

# Decodificar el token JWT
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Endpoint: GET /users
@app.get("/users", response_model=List[UserResponse])
def list_users(current_user: dict = Depends(get_current_user)):
    db = SessionLocal()
    role = current_user.get("role")
    if role == "admin":
        users = db.query(User).all()
    elif role == "doctor":
        users = db.query(User).filter_by(role="paciente").all()
    else:
        db.close()
        raise HTTPException(status_code=403, detail="Not authorized")
    db.close()
    return users
