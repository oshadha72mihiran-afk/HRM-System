from datetime import date

from app.schemas.common import ORMBaseModel


class EmployeeBase(ORMBaseModel):
    employee_code: str
    first_name: str
    last_name: str
    email: str
    phone: str | None = None
    address: str | None = None
    department_id: int
    position_id: int
    joining_date: date | None = None
    employment_type: str
    basic_salary: float
    status: str = "ONBOARDING"


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(ORMBaseModel):
    employee_code: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    department_id: int | None = None
    position_id: int | None = None
    joining_date: date | None = None
    employment_type: str | None = None
    basic_salary: float | None = None
    status: str | None = None


class EmployeeRead(EmployeeBase):
    id: int


class EmployeeDocumentRead(ORMBaseModel):
    id: int
    employee_id: int
    document_type: str
    original_file_name: str
    stored_file_name: str
    file_path: str
    file_size: int
    mime_type: str
    uploaded_by: int | None = None
