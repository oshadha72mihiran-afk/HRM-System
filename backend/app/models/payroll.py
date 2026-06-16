from sqlalchemy import ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.common import TimestampMixin


class Payroll(TimestampMixin, Base):
    __tablename__ = "payrolls"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    month: Mapped[int] = mapped_column(Integer, nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    basic_salary: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    allowances: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    deductions: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    net_salary: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False, default=0)
    payment_status: Mapped[str] = mapped_column(String(30), default="PENDING", nullable=False)

    employee = relationship("Employee", back_populates="payrolls")
