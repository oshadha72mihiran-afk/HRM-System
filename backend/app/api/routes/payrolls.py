from fastapi import APIRouter

from app.schemas.payroll import PayrollCreate, PayrollRead, PayrollUpdate

router = APIRouter()


@router.post("", response_model=PayrollRead)
def create_payroll(payload: PayrollCreate) -> PayrollRead:
    return PayrollRead(id=1, **payload.model_dump())


@router.get("", response_model=list[PayrollRead])
def list_payrolls() -> list[PayrollRead]:
    return []


@router.get("/{payroll_id}", response_model=PayrollRead)
def get_payroll(payroll_id: int) -> PayrollRead:
    return PayrollRead(id=payroll_id, employee_id=1, month=6, year=2026, basic_salary=1000, allowances=100, deductions=50, net_salary=1050, payment_status="PENDING")


@router.patch("/{payroll_id}", response_model=PayrollRead)
def update_payroll(payroll_id: int, payload: PayrollUpdate) -> PayrollRead:
    data = {
        "employee_id": 1,
        "month": 6,
        "year": 2026,
        "basic_salary": 1000,
        "allowances": 100,
        "deductions": 50,
        "net_salary": 1050,
        "payment_status": "PENDING",
    }
    data.update(payload.model_dump(exclude_unset=True))
    return PayrollRead(id=payroll_id, **data)


@router.delete("/{payroll_id}")
def delete_payroll(payroll_id: int) -> dict[str, int]:
    return {"deleted_id": payroll_id}
