from databases import Database
from sqlalchemy import MetaData

DATABASE_URL = "postgresql+asyncpg://admin:admin123@localhost:5433/saludlink"

database = Database(DATABASE_URL)
metadata = MetaData()
