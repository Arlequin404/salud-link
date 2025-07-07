from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, String, or_
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from dotenv import load_dotenv
import uuid, os, requests

# ────────────────────────────
#  ENV & conexión a user_db
# ────────────────────────────
load_dotenv()

DATABASE_URL = (
    f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)

engine       = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
Base         = declarative_base()

# ────────────────────────────
#  Modelos locales
# ────────────────────────────
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

# ────────────────────────────
#  FastAPI setup
# ────────────────────────────
app = FastAPI(title="update-user")

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

# ────────────────────────────
#  Esquema de entrada
# ────────────────────────────
class UserUpdate(BaseModel):
    cedula:    str      | None = None
    name:      str      | None = None
    email:     EmailStr | None = None
    password:  str      | None = None
    phone:     str      | None = None
    birthdate: str      | None = None
    gender:    str      | None = None
    city:      str      | None = None
    address:   str      | None = None
    role:      str      | None = None   # admin / doctor / patient …

# ────────────────────────────
#  Helper  →  MS doctor
# ────────────────────────────
def notify_doctor_service(cedula: str, name: str):
    """
    PUT /api/doctor/{cedula} para mantener la copia del dominio doctor.
    """
    try:
        r = requests.put(
            f"http://create-doctor:8000/api/doctor/{cedula}",
            json={"name": name},
            timeout=5,
        )
        if r.status_code != 200:
            print("⚠️  MS doctor respondió", r.status_code, r.text)
    except Exception as e:
        print("⚠️  No se pudo contactar al MS doctor:", e)

# ────────────────────────────
#  PUT /users/{user_id}
# ────────────────────────────
@app.put("/users/{user_id}")
def update_user(user_id: str, payload: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    # Evitar colisiones de cedula/email al cambiarlas
    if payload.cedula and payload.cedula != user.cedula:
        if db.query(User).filter(User.cedula == payload.cedula).first():
            raise HTTPException(400, "Cedula already in use")
    if payload.email and payload.email != user.email:
        if db.query(User).filter(User.email == payload.email).first():
            raise HTTPException(400, "Email already in use")

    # Detectar si cambian campos que interesan al dominio doctor
    cedula_before, name_before = user.cedula, user.name

    # Actualizar
    for field, value in payload.dict(exclude_none=True).items():
        setattr(user, field, value)

    db.commit(); db.refresh(user)

    # Mantener tabla users_doctors coherente si sigue (o pasa a ser) doctor
    replica = db.query(UsersDoctors).filter_by(user_id=user_id).first()

    if user.role == "doctor":
        if not replica:
            replica = UsersDoctors(user_id=user.id, cedula=user.cedula, name=user.name)
            db.add(replica)
        else:
            replica.cedula = user.cedula
            replica.name   = user.name
        db.commit()

        # Si cambian cedula o nombre ⇒ avisa al otro dominio
        if (user.cedula != cedula_before) or (user.name != name_before):
            notify_doctor_service(user.cedula, user.name)

    # Si el usuario dejó de ser doctor ⇒ borra réplica
    elif replica:
        db.delete(replica); db.commit()
        notify_doctor_service(cedula_before, name_before)  # opcional: para que MS doctor lo archive/borre

    return {"message": "User updated successfully", "user_id": str(user.id)}
