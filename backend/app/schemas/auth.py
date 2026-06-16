from uuid import UUID

from pydantic import EmailStr, Field

from app.models.enums import UserRole
from app.schemas.common import ORMBaseModel


class RegisterRequest(ORMBaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = Field(default=UserRole.HR)


class LoginRequest(ORMBaseModel):
    email: EmailStr
    password: str


class AuthUserResponse(ORMBaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    role: UserRole


class TokenResponse(ORMBaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(ORMBaseModel):
    sub: UUID
    role: UserRole | None = None


class LoginResponse(ORMBaseModel):
    user: AuthUserResponse
    token: TokenResponse


class CurrentUserResponse(AuthUserResponse):
    is_active: bool = True
