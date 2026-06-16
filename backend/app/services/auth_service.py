from app.core.security import create_access_token, hash_password, verify_password
from app.models.enums import UserRole
from app.models.user import User


class AuthService:
    def create_user_password(self, password: str) -> str:
        return hash_password(password)

    def verify_user_password(self, password: str, password_hash: str) -> bool:
        return verify_password(password, password_hash)

    def issue_token(self, subject: str, role: UserRole) -> str:
        return create_access_token(subject, {"role": role.value})

    def user_to_payload(self, user: User) -> dict[str, str]:
        return {
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.value,
        }
