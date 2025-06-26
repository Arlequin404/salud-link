from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid
import os
from dotenv import load_dotenv

# ✅ Cargar variables del archivo .env
load_dotenv()

# Configuración de la base de datos
DATABASE_URL = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Definición del modelo
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

# Instancia de la aplicación
app = FastAPI()

# Habilitar CORS para que acepte DELETE desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint para eliminar usuario
@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    db = SessionLocal()
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    db.close()
    return {"message": "User deleted successfully", "user_id": user_id}
