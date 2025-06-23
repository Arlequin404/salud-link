from sqlalchemy import Table, Column, String, Boolean, Date, DateTime
from sqlalchemy.sql import func
from app.database import metadata

users = Table(
    "users",
    metadata,
    Column("id", String, primary_key=True),
    Column("cedula", String(10), nullable=False),
    Column("name", String, nullable=False),
    Column("email", String, unique=True, nullable=False),
    Column("password", String, nullable=False),
    Column("phone", String),
    Column("birthdate", Date),
    Column("gender", String),
    Column("city", String),
    Column("address", String),
    Column("role", String),
    Column("is_active", Boolean, default=True),
    Column("updated_at", DateTime, server_default=func.now(), onupdate=func.now()),
)
