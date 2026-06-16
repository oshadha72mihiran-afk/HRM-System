from uuid import UUID

from app.schemas.common import ORMBaseModel


class PositionBase(ORMBaseModel):
    department_id: UUID
    title: str
    description: str | None = None
    is_active: bool = True


class PositionCreate(PositionBase):
    pass


class PositionUpdate(ORMBaseModel):
    department_id: UUID | None = None
    title: str | None = None
    description: str | None = None
    is_active: bool | None = None


class PositionRead(PositionBase):
    id: UUID
