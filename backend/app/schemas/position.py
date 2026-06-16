from app.schemas.common import ORMBaseModel


class PositionBase(ORMBaseModel):
    department_id: int
    title: str
    description: str | None = None
    is_active: bool = True


class PositionCreate(PositionBase):
    pass


class PositionUpdate(ORMBaseModel):
    department_id: int | None = None
    title: str | None = None
    description: str | None = None
    is_active: bool | None = None


class PositionRead(PositionBase):
    id: int
