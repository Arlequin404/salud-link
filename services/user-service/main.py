from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from datetime import datetime, timedelta, date
from typing import Optional
import databases
import sqlalchemy
import jwt
import os
from dotenv import load_dotenv
from sqlalchemy import func

load_dotenv()

DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
SECRET_KEY = "saludlink_secret"
ALGORITHM = "HS256"

database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()

users = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String(length=50), primary_key=True),
    sqlalchemy.Column("cedula", sqlalchemy.String(length=10), unique=True, nullable=False),
    sqlalchemy.Column("name", sqlalchemy.String(length=100), nullable=False),
    sqlalchemy.Column("email", sqlalchemy.String(length=100), unique=True, nullable=False),
    sqlalchemy.Column("password", sqlalchemy.String(length=255), nullable=False),
    sqlalchemy.Column("phone", sqlalchemy.String(length=20), nullable=False),
    sqlalchemy.Column("birthdate", sqlalchemy.Date, nullable=False),
    sqlalchemy.Column("gender", sqlalchemy.String(length=10)),
    sqlalchemy.Column("city", sqlalchemy.String(length=100), nullable=False),
    sqlalchemy.Column("address", sqlalchemy.String(length=255)),
    sqlalchemy.Column("role", sqlalchemy.String(length=20), nullable=False),
    sqlalchemy.Column("is_active", sqlalchemy.Boolean, server_default='true'),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, server_default=func.now()),
    sqlalchemy.Column("updated_at", sqlalchemy.DateTime, server_default=func.now(), onupdate=func.now()),
)

engine = sqlalchemy.create_engine(DATABASE_URL)
metadata.create_all(engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class UserIn(BaseModel):
    id: str
    cedula: str
    name: str
    email: EmailStr
    password: str
    phone: str
    birthdate: date
    gender: Optional[str] = None
    city: str
    address: Optional[str] = None
    role: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str

class Login(BaseModel):
    email: str
    password: str

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def only_admin(payload: dict = Depends(verify_token)):
    if payload["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return payload

@app.post("/register", response_model=UserOut)
async def register(user: UserIn):
    conflict = await database.fetch_one(
        users.select().where(
            (users.c.email == user.email) |
            (users.c.cedula == user.cedula) |
            (users.c.id == user.id)
        )
    )
    if conflict:
        raise HTTPException(status_code=400, detail="User with same email, cedula or id already exists")

    hashed_pw = pwd_context.hash(user.password)
    query = users.insert().values(
        id=user.id,
        cedula=user.cedula,
        name=user.name,
        email=user.email,
        password=hashed_pw,
        phone=user.phone,
        birthdate=user.birthdate,
        gender=user.gender,
        city=user.city,
        address=user.address,
        role=user.role,
        is_active=True
    )
    await database.execute(query)
    return UserOut(id=user.id, name=user.name, email=user.email, role=user.role)

@app.post("/login")
async def login(data: Login):
    query = users.select().where(users.c.email == data.email)
    user = await database.fetch_one(query)
    if not user or not pwd_context.verify(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user["is_active"]:
        raise HTTPException(status_code=403, detail="Inactive user")
    payload = {
        "sub": user["id"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}

@app.get("/me")
async def me(payload: dict = Depends(verify_token)):
    return {
        "user_id": payload["sub"],
        "role": payload["role"]
    }

@app.get("/admin-area")
async def admin_area(payload: dict = Depends(only_admin)):
    return {"message": f"Welcome Admin {payload['sub']}"}


def only_paciente(payload: dict = Depends(verify_token)):
    if payload["role"] != "paciente":
        raise HTTPException(status_code=403, detail="Paciente access required")
    return payload

def only_doctor(payload: dict = Depends(verify_token)):
    if payload["role"] != "doctor":
        raise HTTPException(status_code=403, detail="Doctor access required")
    return payload

@app.get("/paciente-area")
async def paciente_area(payload: dict = Depends(only_paciente)):
    return {"message": f"Bienvenido/a paciente {payload['sub']}"}

@app.get("/doctor-area")
async def doctor_area(payload: dict = Depends(only_doctor)):
    return {"message": f"Bienvenido/a doctor {payload['sub']}"}
