from datetime import datetime
from uuid import UUID

from app.schemas.common import ORMBaseModel
from app.models.enums import PaymentStatus


class PayrollBase(ORMBaseModel):
    employee_id: UUID
    month: int
    year: int
    basic_salary: float
    allowances: float = 0
    deductions: float = 0
    net_salary: float = 0
    payment_status: PaymentStatus = PaymentStatus.PENDING


class PayrollCreate(PayrollBase):
    pass


class PayrollUpdate(ORMBaseModel):
    employee_id: UUID | None = None
    month: int | None = None
    year: int | None = None
    basic_salary: float | None = None
    allowances: float | None = None
    deductions: float | None = None
    net_salary: float | None = None
    payment_status: PaymentStatus | None = None


class PayrollRead(PayrollBase):
    id: UUID
    net_salary: float
    created_at: datetime
    updated_at: datetime
