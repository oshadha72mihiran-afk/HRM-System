from fastapi import APIRouter

from app.schemas.department import DepartmentCreate, DepartmentRead, DepartmentUpdate

router = APIRouter()


@router.post("", response_model=DepartmentRead)
def create_department(payload: DepartmentCreate) -> DepartmentRead:
    return DepartmentRead(id=1, **payload.model_dump())


@router.get("", response_model=list[DepartmentRead])
def list_departments() -> list[DepartmentRead]:
    return []


@router.get("/{department_id}", response_model=DepartmentRead)
def get_department(department_id: int) -> DepartmentRead:
    return DepartmentRead(id=department_id, name="Operations", description="Operations department", is_active=True)


@router.patch("/{department_id}", response_model=DepartmentRead)
def update_department(department_id: int, payload: DepartmentUpdate) -> DepartmentRead:
    data = {"name": "Operations", "description": None, "is_active": True}
    data.update(payload.model_dump(exclude_unset=True))
    return DepartmentRead(id=department_id, **data)


@router.delete("/{department_id}")
def delete_department(department_id: int) -> dict[str, int]:
    return {"deleted_id": department_id}
