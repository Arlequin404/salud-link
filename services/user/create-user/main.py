from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, String, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import uuid
import os
import time

DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

# Retry database connection
MAX_RETRIES = 10
for i in range(MAX_RETRIES):
    try:
        engine = create_engine(DATABASE_URL)
        engine.connect()
        break
    except Exception as e:
        print(f"Database not ready, retrying ({i+1}/{MAX_RETRIES})...")
        time.sleep(3)
else:
    raise Exception("Could not connect to the database after several attempts.")

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
    birthdate = Column(Date)
    gender = Column(String(1))
    city = Column(String(100))
    address = Column(String(255))
    role = Column(String(50))

Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ Middleware CORS para frontend en localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    cedula: str
    name: str
    email: EmailStr
    password: str
    phone: str = None
    birthdate: str = None
    gender: str = None
    city: str = None
    address: str = None
    role: str

@app.post("/users")
def create_user(user: UserCreate, x_role: str = Header(...)):
    if x_role not in ["admin", "doctor"]:
        raise HTTPException(status_code=403, detail="Only admin or doctor can create users")

    db = SessionLocal()
    existing_email = db.query(User).filter_by(email=user.email).first()
    if existing_email:
        db.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_cedula = db.query(User).filter_by(cedula=user.cedula).first()
    if existing_cedula:
        db.close()
        raise HTTPException(status_code=400, detail="Cedula already registered")

    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()
    return {"message": "User created successfully", "user_id": str(new_user.id)}
