from sqlalchemy import MetaData
from databases import Database

import os

DATABASE_URL = os.getenv("DATABASE_URL")

database = Database(DATABASE_URL)
metadata = MetaData() 
