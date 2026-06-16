from fastapi import APIRouter

from app.schemas.position import PositionCreate, PositionRead, PositionUpdate

router = APIRouter()


@router.post("", response_model=PositionRead)
def create_position(payload: PositionCreate) -> PositionRead:
    return PositionRead(id=1, **payload.model_dump())


@router.get("", response_model=list[PositionRead])
def list_positions() -> list[PositionRead]:
    return []


@router.get("/{position_id}", response_model=PositionRead)
def get_position(position_id: int) -> PositionRead:
    return PositionRead(id=position_id, department_id=1, title="HR Officer", description="", is_active=True)


@router.patch("/{position_id}", response_model=PositionRead)
def update_position(position_id: int, payload: PositionUpdate) -> PositionRead:
    data = {"department_id": 1, "title": "HR Officer", "description": None, "is_active": True}
    data.update(payload.model_dump(exclude_unset=True))
    return PositionRead(id=position_id, **data)


@router.delete("/{position_id}")
def delete_position(position_id: int) -> dict[str, int]:
    return {"deleted_id": position_id}
