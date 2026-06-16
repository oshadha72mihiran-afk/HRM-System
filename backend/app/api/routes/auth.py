from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_roles
from app.db.session import get_db
from app.models.enums import UserRole
from app.repositories.auth_repository import AuthRepository
from app.schemas.auth import AuthUserResponse, CurrentUserResponse, LoginRequest, LoginResponse, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()
auth_service = AuthService()


def to_auth_user_response(user) -> AuthUserResponse:
    return AuthUserResponse(id=user.id, full_name=user.full_name, email=user.email, role=user.role)


@router.post("/register", response_model=AuthUserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, database: Session = Depends(get_db)) -> AuthUserResponse:
    repository = AuthRepository(database)
    existing_user = repository.get_by_email(payload.email)

    if existing_user is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = repository.create_user(
        full_name=payload.full_name,
        email=str(payload.email),
        password_hash=auth_service.create_user_password(payload.password),
        role=payload.role,
    )
    return to_auth_user_response(user)


@router.post("/login", response_model=LoginResponse)
def login_user(payload: LoginRequest, database: Session = Depends(get_db)) -> LoginResponse:
    repository = AuthRepository(database)
    user = repository.get_by_email(str(payload.email))

    if user is None or not auth_service.verify_user_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = TokenResponse(access_token=auth_service.issue_token(str(user.id), user.role))
    return LoginResponse(user=to_auth_user_response(user), token=token)


@router.get("/me", response_model=CurrentUserResponse)
def get_me(current_user=Depends(get_current_user)) -> CurrentUserResponse:
    return CurrentUserResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        role=current_user.role,
        is_active=current_user.is_active,
    )


@router.post("/logout")
def logout_user(current_user=Depends(get_current_user)) -> dict[str, bool]:
    _ = current_user
    return {"success": True}


@router.get("/admin-only")
def admin_only(current_user=Depends(require_roles(UserRole.ADMIN))) -> dict[str, str]:
    return {"message": f"Hello, {current_user.full_name}. You have admin access."}
