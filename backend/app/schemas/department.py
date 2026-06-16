from uuid import UUID

from app.schemas.common import ORMBaseModel


class DepartmentBase(ORMBaseModel):
    name: str
    description: str | None = None
    is_active: bool = True


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(ORMBaseModel):
    name: str | None = None
    description: str | None = None
    is_active: bool | None = None


class DepartmentRead(DepartmentBase):
    id: UUID
