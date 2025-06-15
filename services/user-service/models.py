from sqlalchemy import Table, Column, String, Boolean, Date, DateTime
from sqlalchemy.sql import func
from db import metadata

users = Table(
    "users",
    metadata,
    Column("id", String(50), primary_key=True),
    Column("cedula", String(10), nullable=False, unique=True),
    Column("name", String(100), nullable=False),
    Column("email", String(100), nullable=False, unique=True),
    Column("password", String(255), nullable=False),
    Column("phone", String(20), nullable=False),
    Column("birthdate", Date, nullable=False),
    Column("gender", String(10)),
    Column("city", String(100), nullable=False),
    Column("address", String(255)),
    Column("role", String(20), nullable=False),
    Column("is_active", Boolean, default=True),
    Column("created_at", DateTime, server_default=func.now()),
    Column("updated_at", DateTime, server_default=func.now(), onupdate=func.now())
)
