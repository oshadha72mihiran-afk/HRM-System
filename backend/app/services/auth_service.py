from app.core.security import create_access_token, hash_password, verify_password


class AuthService:
    def create_user_password(self, password: str) -> str:
        return hash_password(password)

    def verify_user_password(self, password: str, password_hash: str) -> bool:
        return verify_password(password, password_hash)

    def issue_token(self, subject: str) -> str:
        return create_access_token(subject)
