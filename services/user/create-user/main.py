# main.py
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator
from sqlalchemy import create_engine, Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import uuid, os, time, datetime, requests

# ──────────────────────────────
#  DB CONFIG
# ──────────────────────────────
DB_USER     = os.getenv("POSTGRES_USER", "admin")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "admin123")
DB_HOST     = os.getenv("POSTGRES_HOST", "postgres-user")
DB_PORT     = os.getenv("POSTGRES_PORT", "5432")
DB_NAME     = os.getenv("POSTGRES_DB", "user_db")
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Espera a que Postgres esté listo
for _ in range(10):
    try:
        create_engine(DATABASE_URL).connect()
        break
    except Exception:
        time.sleep(3)
else:
    raise RuntimeError("❌ Postgres nunca arrancó")

engine       = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
Base         = declarative_base()

# ──────────────────────────────
#  MODELOS
# ──────────────────────────────
class User(Base):
    __tablename__ = "users"
    id        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cedula    = Column(String(20), unique=True, nullable=False)
    name      = Column(String(255), nullable=False)
    email     = Column(String(255), unique=True, nullable=False)
    password  = Column(String(255), nullable=False)
    phone     = Column(String(20))
    birthdate = Column(String)
    gender    = Column(String(1))
    city      = Column(String(100))
    address   = Column(String(255))
    role      = Column(String(50))

class UsersDoctors(Base):
    __tablename__ = "users_doctors"
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    cedula  = Column(String(20), unique=True, nullable=False)
    name    = Column(String(255), nullable=False)

Base.metadata.create_all(bind=engine, checkfirst=True)

# ──────────────────────────────
#  FASTAPI
# ──────────────────────────────
app = FastAPI(title="create-user")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    cedula: str
    name: str
    email: EmailStr
    password: str
    phone: str | None = None
    birthdate: str | None = None
    gender: str | None = None
    city: str | None = None
    address: str | None = None
    role: str

    @validator("birthdate", pre=True, always=True)
    def parse_birthdate(cls, v):
        return datetime.date.fromisoformat(v).isoformat() if v else None

def sync_doctor_data(user_id: str, cedula: str, name: str):
    url = "http://create-doctor:8006/api/doctor"  # <--- puerto 8006
    payload = {"user_id": user_id, "cedula": cedula, "name": name}
    try:
        resp = requests.post(url, json=payload, timeout=5)
        resp.raise_for_status()
    except Exception as e:
        print("⚠️  create-doctor unreachable:", e)

@app.post("/users", status_code=201)
def create_user(
    user: UserCreate,
    x_role: str = Header(..., alias="x-role"),
    db: Session = Depends(get_db)
):
    # 1) Sólo admins
    if x_role.lower() != "admin":
        raise HTTPException(403, "Only admin can create users")

    # 2) Unicidad
    if db.query(User).filter((User.email == user.email) | (User.cedula == user.cedula)).first():
        raise HTTPException(400, "Email o cédula ya registrados")

    # 3) Crear usuario
    new_user = User(
        **user.dict(exclude={"birthdate"}),
        birthdate=UserCreate.parse_birthdate(user.birthdate)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 4) Si es doctor, replica y notifica
    if user.role.lower() == "doctor":
        db.add(UsersDoctors(
            user_id=new_user.id,
            cedula=new_user.cedula,
            name=new_user.name
        ))
        db.commit()  # <--- asegura que la FK quede guardada
        sync_doctor_data(str(new_user.id), new_user.cedula, new_user.name)

    return {"message": "User created", "user_id": str(new_user.id)}
