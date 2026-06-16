from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_roles
from app.db.session import get_db
from app.models.enums import UserRole
from app.schemas.department import DepartmentCreate, DepartmentRead, DepartmentUpdate
from app.schemas.common import ORMBaseModel

router = APIRouter()


class DepartmentPayload(ORMBaseModel):
    id: UUID | None = None
    name: str
    description: str | None = None
    is_active: bool = True


def _department_to_read(department) -> DepartmentRead:
    return DepartmentRead(id=department.id, name=department.name, description=department.description, is_active=department.is_active)


@router.post("", response_model=DepartmentRead, dependencies=[Depends(require_roles(UserRole.ADMIN, UserRole.HR))])
def create_department(payload: DepartmentCreate, database: Session = Depends(get_db)) -> DepartmentRead:
    from app.models.department import Department

    department = Department(name=payload.name, description=payload.description, is_active=payload.is_active)
    database.add(department)
    database.commit()
    database.refresh(department)
    return _department_to_read(department)


@router.get("", response_model=list[DepartmentRead])
def list_departments(database: Session = Depends(get_db)) -> list[DepartmentRead]:
    from sqlalchemy import select
    from app.models.department import Department

    departments = database.scalars(select(Department).order_by(Department.created_at.desc())).all()
    return [_department_to_read(department) for department in departments]


@router.get("/{department_id}", response_model=DepartmentRead)
def get_department(department_id: UUID, database: Session = Depends(get_db)) -> DepartmentRead:
    from fastapi import HTTPException, status
    from app.models.department import Department

    department = database.get(Department, department_id)
    if department is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")
    return _department_to_read(department)


@router.patch("/{department_id}", response_model=DepartmentRead)
def update_department(department_id: UUID, payload: DepartmentUpdate, database: Session = Depends(get_db)) -> DepartmentRead:
    from fastapi import HTTPException, status
    from app.models.department import Department

    department = database.get(Department, department_id)
    if department is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(department, field, value)

    database.commit()
    database.refresh(department)
    return _department_to_read(department)


@router.delete("/{department_id}")
def delete_department(department_id: UUID, database: Session = Depends(get_db)) -> dict[str, str]:
    from fastapi import HTTPException, status
    from app.models.department import Department

    department = database.get(Department, department_id)
    if department is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Department not found")

    database.delete(department)
    database.commit()
    return {"deleted_id": str(department_id)}
