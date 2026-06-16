from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class AuthRepository:
    def __init__(self, database: Session) -> None:
        self.database = database

    def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        return self.database.scalars(statement).first()

    def get_by_id(self, user_id) -> User | None:
        return self.database.get(User, user_id)

    def create_user(self, *, full_name: str, email: str, password_hash: str, role) -> User:
        user = User(full_name=full_name, email=email, password_hash=password_hash, role=role)
        self.database.add(user)
        self.database.commit()
        self.database.refresh(user)
        return user
