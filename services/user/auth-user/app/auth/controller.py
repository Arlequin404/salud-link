from fastapi import APIRouter, HTTPException, Depends, status
from app.auth.schema import Token, UserResponse, LoginRequest
from app.auth.service import get_user_by_email
from app.auth.jwt import create_access_token, verify_token
from passlib.context import CryptContext

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/login")
async def login(data: LoginRequest):
    user = await get_user_by_email(data.email)
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({"sub": user.email})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "role": user.role,
            "name": user.name,  
            "is_active": user.is_active
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_me(token: dict = Depends(verify_token)):
    email = token.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
