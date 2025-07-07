from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, ConfigDict
from sqlalchemy import create_engine, Column, String, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import date
import uuid, os, jwt
from typing import List, Optional
from dotenv import load_dotenv

# ───────────────────────────────
# Configuración y BD
# ───────────────────────────────
load_dotenv()

DATABASE_URL = (
    f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
    f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
)
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")

engine       = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)
Base         = declarative_base()

class User(Base):
    __tablename__ = "users"
    id        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cedula    = Column(String(20), unique=True, nullable=False)
    name      = Column(String(255), nullable=False)
    email     = Column(String(255), unique=True, nullable=False)
    password  = Column(String(255), nullable=False)
    phone     = Column(String(20))
    birthdate = Column(Date)
    gender    = Column(String(1))
    city      = Column(String(100))
    address   = Column(String(255))
    role      = Column(String(50))

# ───────────────────────────────
# Esquemas de respuesta (Pydantic v2)
# ───────────────────────────────
COMMON_CFG = ConfigDict(from_attributes=True)

class UserListRes(BaseModel):
    id:        uuid.UUID
    cedula:    str
    name:      str
    email:     EmailStr
    phone:     Optional[str]  = None
    birthdate: Optional[date] = None
    gender:    Optional[str]  = None
    city:      Optional[str]  = None
    address:   Optional[str]  = None
    role:      str
    password:  Optional[str]  = None  # Campo para contraseña (opcional)
    model_config = COMMON_CFG

class UserDetailRes(UserListRes):
    """Detalle: hereda todos los campos de lista (ya incluye todo)."""

# ───────────────────────────────
# FastAPI
# ───────────────────────────────
app = FastAPI(title="get-user (list & detail)")
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Valida el JWT y devuelve el payload."""
    try:
        return jwt.decode(creds.credentials, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ───────────────────────────────
# ENDPOINTS
# ───────────────────────────────
@app.get("/users", response_model=List[UserListRes])
def list_users(user: dict = Depends(current_user)):
    """
    - **admin**  → todos (con contraseña)
    - **doctor** → solo _pacientes_
    """
    db = SessionLocal()
    try:
        match user["role"]:
            case "admin":
                rows = db.query(User).all()
                # Incluimos la contraseña si el rol es admin
                for row in rows:
                    row.password = row.password  # Asegurarnos de que se devuelva la contraseña
            case "doctor":
                rows = db.query(User).filter_by(role="paciente").all()
            case _:
                raise HTTPException(status_code=403, detail="Not authorized")
        return rows
    finally:
        db.close()

@app.get("/users/{uid}", response_model=UserDetailRes)
def get_user_detail(uid: uuid.UUID, user: dict = Depends(current_user)):
    """
    Detalle completo de un usuario.
    • admin   → cualquiera  
    • doctor  → solo pacientes  
    • usuario → su propio perfil
    """
    db = SessionLocal()
    try:
        row = db.query(User).filter_by(id=uid).first()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        # reglas de autorización
        if user["role"] == "admin":
            return row
        if user["role"] == "doctor" and row.role == "paciente":
            return row
        if str(user.get("sub")) == str(uid):
            return row

        raise HTTPException(status_code=403, detail="Not authorized")
    finally:
        db.close()
