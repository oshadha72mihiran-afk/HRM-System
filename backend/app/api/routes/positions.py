from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.position import PositionCreate, PositionRead, PositionUpdate

router = APIRouter()


def _position_to_read(position) -> PositionRead:
    return PositionRead(id=position.id, department_id=position.department_id, title=position.title, description=position.description, is_active=position.is_active)


@router.post("", response_model=PositionRead)
def create_position(payload: PositionCreate, database: Session = Depends(get_db)) -> PositionRead:
    from app.models.position import Position

    position = Position(**payload.model_dump())
    database.add(position)
    database.commit()
    database.refresh(position)
    return _position_to_read(position)


@router.get("", response_model=list[PositionRead])
def list_positions(database: Session = Depends(get_db)) -> list[PositionRead]:
    from sqlalchemy import select
    from app.models.position import Position

    positions = database.scalars(select(Position).order_by(Position.created_at.desc())).all()
    return [_position_to_read(position) for position in positions]


@router.get("/{position_id}", response_model=PositionRead)
def get_position(position_id: UUID, database: Session = Depends(get_db)) -> PositionRead:
    from fastapi import HTTPException, status
    from app.models.position import Position

    position = database.get(Position, position_id)
    if position is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Position not found")
    return _position_to_read(position)


@router.patch("/{position_id}", response_model=PositionRead)
def update_position(position_id: UUID, payload: PositionUpdate, database: Session = Depends(get_db)) -> PositionRead:
    from fastapi import HTTPException, status
    from app.models.position import Position

    position = database.get(Position, position_id)
    if position is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Position not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(position, field, value)

    database.commit()
    database.refresh(position)
    return _position_to_read(position)


@router.delete("/{position_id}")
def delete_position(position_id: UUID, database: Session = Depends(get_db)) -> dict[str, str]:
    from fastapi import HTTPException, status
    from app.models.position import Position

    position = database.get(Position, position_id)
    if position is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Position not found")

    database.delete(position)
    database.commit()
    return {"deleted_id": str(position_id)}
