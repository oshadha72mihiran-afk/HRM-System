from app.schemas.common import ORMBaseModel


class PayrollBase(ORMBaseModel):
    employee_id: int
    month: int
    year: int
    basic_salary: float
    allowances: float = 0
    deductions: float = 0
    net_salary: float = 0
    payment_status: str = "PENDING"


class PayrollCreate(PayrollBase):
    pass


class PayrollUpdate(ORMBaseModel):
    employee_id: int | None = None
    month: int | None = None
    year: int | None = None
    basic_salary: float | None = None
    allowances: float | None = None
    deductions: float | None = None
    net_salary: float | None = None
    payment_status: str | None = None


class PayrollRead(PayrollBase):
    id: int
