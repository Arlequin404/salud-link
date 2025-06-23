from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
