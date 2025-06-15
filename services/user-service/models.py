from sqlalchemy import Table, Column, String
from db import metadata

users_table = Table(
    "users",
    metadata,
    Column("id", String, primary_key=True),
    Column("name", String),
    Column("role", String)
)
