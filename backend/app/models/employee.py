from datetime import date
from uuid import UUID

from sqlalchemy import Date, Enum as SAEnum, ForeignKey, Numeric, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.common import TimestampMixin
from app.models.enums import EmployeeStatus, EmploymentType


class Employee(TimestampMixin, Base):
    __tablename__ = "employees"

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, index=True, server_default=text("gen_random_uuid()"))
    employee_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    department_id: Mapped[UUID | None] = mapped_column(ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    position_id: Mapped[UUID | None] = mapped_column(ForeignKey("positions.id", ondelete="SET NULL"), nullable=True)
    joining_date: Mapped[date] = mapped_column(Date, nullable=False)
    employment_type: Mapped[EmploymentType] = mapped_column(SAEnum(EmploymentType, name="employment_type"), nullable=False, default=EmploymentType.FULL_TIME)
    basic_salary: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    status: Mapped[EmployeeStatus] = mapped_column(SAEnum(EmployeeStatus, name="employee_status"), default=EmployeeStatus.ONBOARDING, nullable=False)

    department = relationship("Department", back_populates="employees")
    position = relationship("Position", back_populates="employees")
    documents = relationship("EmployeeDocument", back_populates="employee")
    payrolls = relationship("Payroll", back_populates="employee")
