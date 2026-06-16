from uuid import UUID

from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.common import TimestampMixin
from app.models.enums import DocumentType


class EmployeeDocument(TimestampMixin, Base):
    __tablename__ = "employee_documents"

    __table_args__ = (
        CheckConstraint("file_size > 0 AND file_size <= 5242880", name="chk_employee_documents_file_size"),
        CheckConstraint("mime_type IN ('application/pdf', 'image/jpeg', 'image/jpg', 'image/png')", name="chk_employee_documents_mime_type"),
    )

    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, index=True, server_default=text("gen_random_uuid()"))
    employee_id: Mapped[UUID] = mapped_column(ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    document_type: Mapped[DocumentType] = mapped_column(SAEnum(DocumentType, name="document_type"), nullable=False, default=DocumentType.OTHER)
    original_file_name: Mapped[str] = mapped_column(String(500), nullable=False)
    stored_file_name: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)
    file_path: Mapped[str] = mapped_column(Text, nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    uploaded_by: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=text("NOW()"), nullable=False)

    employee = relationship("Employee", back_populates="documents")
