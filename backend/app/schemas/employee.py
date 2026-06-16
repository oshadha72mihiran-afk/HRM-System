# backend/app/schemas/employee.py
from datetime import date, datetime
from uuid import UUID

from app.schemas.common import ORMBaseModel
from app.models.enums import DocumentType, EmployeeStatus, EmploymentType


class EmployeeBase(ORMBaseModel):
    employee_code: str
    first_name: str
    last_name: str
    email: str
    phone: str | None = None
    address: str | None = None
    department_id: UUID | None = None
    position_id: UUID | None = None
    joining_date: date
    employment_type: EmploymentType = EmploymentType.FULL_TIME
    basic_salary: float
    status: EmployeeStatus = EmployeeStatus.ONBOARDING


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(ORMBaseModel):
    employee_code: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    department_id: UUID | None = None
    position_id: UUID | None = None
    joining_date: date | None = None
    employment_type: EmploymentType | None = None
    basic_salary: float | None = None
    status: EmployeeStatus | None = None


class EmployeeRead(EmployeeBase):
    id: UUID


class EmployeeDocumentRead(ORMBaseModel):
    id: UUID
    employee_id: UUID
    document_type: DocumentType
    original_file_name: str
    stored_file_name: str
    file_path: str
    file_size: int
    mime_type: str
    uploaded_by: UUID
    uploaded_at: datetime