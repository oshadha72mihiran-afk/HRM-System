# backend/app/api/routes/payrolls.py
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.payroll import PayrollCreate, PayrollRead, PayrollUpdate

router = APIRouter()


def _payroll_to_read(payroll) -> PayrollRead:
    # Get net_salary from the database using a query
    # Since it's a generated column, we need to fetch it
    return PayrollRead(
        id=payroll.id,
        employee_id=payroll.employee_id,
        month=payroll.month,
        year=payroll.year,
        basic_salary=payroll.basic_salary,
        allowances=payroll.allowances,
        deductions=payroll.deductions,
        net_salary=float(payroll.basic_salary + payroll.allowances - payroll.deductions),  # Calculate manually
        payment_status=payroll.payment_status,
        created_at=payroll.created_at,
        updated_at=payroll.updated_at,
    )


@router.post("", response_model=PayrollRead)
def create_payroll(payload: PayrollCreate, database: Session = Depends(get_db)) -> PayrollRead:
    from app.models.payroll import Payroll

    # Convert payload to dict (net_salary is not in the payload)
    payroll_data = payload.model_dump()
    
    # Create payroll without net_salary
    payroll = Payroll(**payroll_data)
    database.add(payroll)
    database.commit()
    database.refresh(payroll)
    
    # The net_salary will be calculated by the database
    # We need to fetch it from the database to return it
    return _payroll_to_read(payroll)


@router.get("", response_model=list[PayrollRead])
def list_payrolls(database: Session = Depends(get_db)) -> list[PayrollRead]:
    from app.models.payroll import Payroll

    payrolls = database.scalars(select(Payroll).order_by(Payroll.created_at.desc())).all()
    return [_payroll_to_read(payroll) for payroll in payrolls]


@router.get("/{payroll_id}", response_model=PayrollRead)
def get_payroll(payroll_id: UUID, database: Session = Depends(get_db)) -> PayrollRead:
    from fastapi import HTTPException, status
    from app.models.payroll import Payroll

    payroll = database.get(Payroll, payroll_id)
    if payroll is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll not found")
    return _payroll_to_read(payroll)


@router.patch("/{payroll_id}", response_model=PayrollRead)
def update_payroll(payroll_id: UUID, payload: PayrollUpdate, database: Session = Depends(get_db)) -> PayrollRead:
    from fastapi import HTTPException, status
    from app.models.payroll import Payroll

    payroll = database.get(Payroll, payroll_id)
    if payroll is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll not found")

    # Only update fields that are provided
    update_data = payload.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(payroll, field, value)

    database.commit()
    database.refresh(payroll)
    return _payroll_to_read(payroll)


@router.delete("/{payroll_id}")
def delete_payroll(payroll_id: UUID, database: Session = Depends(get_db)) -> dict[str, str]:
    from fastapi import HTTPException, status
    from app.models.payroll import Payroll

    payroll = database.get(Payroll, payroll_id)
    if payroll is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll not found")

    database.delete(payroll)
    database.commit()
    return {"deleted_id": str(payroll_id)}