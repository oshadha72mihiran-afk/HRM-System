from fastapi import APIRouter, status

from app.schemas.auth import AuthUserResponse, LoginRequest, RegisterRequest, TokenResponse

router = APIRouter()


@router.post("/register", response_model=AuthUserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest) -> AuthUserResponse:
    return AuthUserResponse(id=1, full_name=payload.full_name, email=payload.email, role=payload.role)


@router.post("/login", response_model=TokenResponse)
def login_user(payload: LoginRequest) -> TokenResponse:
    return TokenResponse(access_token="demo-token")


@router.get("/me", response_model=AuthUserResponse)
def get_me() -> AuthUserResponse:
    return AuthUserResponse(id=1, full_name="Demo Admin", email="admin@example.com", role="ADMIN")


@router.post("/logout")
def logout_user() -> dict[str, bool]:
    return {"success": True}
