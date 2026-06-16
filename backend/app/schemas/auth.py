from pydantic import EmailStr, Field

from app.schemas.common import ORMBaseModel


class RegisterRequest(ORMBaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: str = Field(default="ADMIN", max_length=50)


class LoginRequest(ORMBaseModel):
    email: EmailStr
    password: str


class AuthUserResponse(ORMBaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str


class TokenResponse(ORMBaseModel):
    access_token: str
    token_type: str = "bearer"
