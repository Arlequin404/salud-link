from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth import create_jwt, verify_user

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(user: User):
    if verify_user(user.username, user.password):
        token = create_jwt(user.username)
        return {"access_token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")
