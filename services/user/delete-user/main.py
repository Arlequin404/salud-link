from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import uuid, os, requests

# ─────────────────────────────────────────────
#  .env  & conexión a user_db
# ─────────────────────────────────────────────
load_dotenv()

DATABASE_URL = (
    f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)

engine       = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)
Base         = declarative_base()

# ─────────────────────────────────────────────
#  Modelos locales
# ─────────────────────────────────────────────
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

# ─────────────────────────────────────────────
#  FastAPI
# ─────────────────────────────────────────────
app = FastAPI(title="delete-user")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
#  Helper → avisa al dominio doctor
# ─────────────────────────────────────────────
def delete_doctor_in_doctor_db(cedula: str):
    """
    Envío DELETE al MS create-doctor
    (corre en el mismo compose, puerto 8000).
    """
    try:
        resp = requests.delete(
            f"http://create-doctor:8000/api/doctor/{cedula}",
            timeout=5
        )
        if resp.status_code == 200:
            print(f"🗑️  Doctor {cedula} eliminado en doctor_db")
        else:
            print("⚠️  MS doctor respondió", resp.status_code, resp.text)
    except Exception as e:
        print("⚠️  No se pudo contactar a MS doctor:", e)

# ─────────────────────────────────────────────
#  ENDPOINT  DELETE /users/{user_id}
# ─────────────────────────────────────────────
@app.delete("/users/{user_id}")
def delete_user(
    user_id: str,
    x_role: str = Header(..., alias="x-role")   # sólo admin puede borrar
):
    if x_role.lower() != "admin":
        raise HTTPException(403, "Only admin can delete users")

    db = SessionLocal()
    try:
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            raise HTTPException(404, "User not found")

        # Si es doctor ⇒ eliminar réplica y avisar al otro dominio
        if user.role.lower() == "doctor":
            replica = db.query(UsersDoctors).filter_by(user_id=user_id).first()
            if replica:
                db.delete(replica)
            delete_doctor_in_doctor_db(user.cedula)

        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully", "user_id": user_id}

    finally:
        db.close()
