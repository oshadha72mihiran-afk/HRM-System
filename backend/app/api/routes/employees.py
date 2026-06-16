# backend/app/api/routes/employees.py
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.enums import DocumentType, EmployeeStatus, EmploymentType
from app.schemas.employee import EmployeeCreate, EmployeeDocumentRead, EmployeeRead, EmployeeUpdate

router = APIRouter()

ALLOWED_MIME_TYPES = {"application/pdf", "image/jpeg", "image/jpg", "image/png"}
MAX_FILE_SIZE = 5 * 1024 * 1024


def _employee_to_read(employee) -> EmployeeRead:
    return EmployeeRead(
        id=employee.id,
        employee_code=employee.employee_code,
        first_name=employee.first_name,
        last_name=employee.last_name,
        email=employee.email,
        phone=employee.phone,
        address=employee.address,
        department_id=employee.department_id,
        position_id=employee.position_id,
        joining_date=employee.joining_date,
        employment_type=employee.employment_type,
        basic_salary=employee.basic_salary,
        status=employee.status,
    )


def _document_to_read(document) -> EmployeeDocumentRead:
    return EmployeeDocumentRead(
        id=document.id,
        employee_id=document.employee_id,
        document_type=document.document_type,
        original_file_name=document.original_file_name,
        stored_file_name=document.stored_file_name,
        file_path=document.file_path,
        file_size=document.file_size,
        mime_type=document.mime_type,
        uploaded_by=document.uploaded_by,
        uploaded_at=document.created_at,  # Use created_at from TimestampMixin
    )


@router.post("", response_model=EmployeeRead)
def create_employee(payload: EmployeeCreate, database: Session = Depends(get_db)) -> EmployeeRead:
    from app.models.employee import Employee

    employee = Employee(**payload.model_dump())
    database.add(employee)
    database.commit()
    database.refresh(employee)
    return _employee_to_read(employee)


@router.get("", response_model=list[EmployeeRead])
def list_employees(database: Session = Depends(get_db)) -> list[EmployeeRead]:
    from app.models.employee import Employee

    employees = database.scalars(select(Employee).order_by(Employee.created_at.desc())).all()
    return [_employee_to_read(employee) for employee in employees]


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(employee_id: UUID, database: Session = Depends(get_db)) -> EmployeeRead:
    from app.models.employee import Employee

    employee = database.get(Employee, employee_id)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return _employee_to_read(employee)


@router.patch("/{employee_id}", response_model=EmployeeRead)
def update_employee(employee_id: UUID, payload: EmployeeUpdate, database: Session = Depends(get_db)) -> EmployeeRead:
    from app.models.employee import Employee

    employee = database.get(Employee, employee_id)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)

    database.commit()
    database.refresh(employee)
    return _employee_to_read(employee)


@router.delete("/{employee_id}")
def delete_employee(employee_id: UUID, database: Session = Depends(get_db)) -> dict[str, str]:
    from app.models.employee import Employee

    employee = database.get(Employee, employee_id)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    database.delete(employee)
    database.commit()
    return {"deleted_id": str(employee_id)}


@router.post("/{employee_id}/documents", response_model=list[EmployeeDocumentRead])
async def upload_employee_documents(
    employee_id: UUID,
    document_type: DocumentType = Form(default=DocumentType.OTHER),
    files: list[UploadFile] = File(...),
    current_user=Depends(get_current_user),
    database: Session = Depends(get_db),
) -> list[EmployeeDocumentRead]:
    from pathlib import Path
    from uuid import uuid4
    from app.models.employee import Employee
    from app.models.employee_document import EmployeeDocument

    employee = database.get(Employee, employee_id)
    if employee is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    upload_dir = Path("uploads") / str(employee_id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    created_documents: list[EmployeeDocumentRead] = []
    for upload in files:
        if upload.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Unsupported file type: {upload.content_type}. Allowed: PDF, JPG, JPEG, PNG"
            )

        contents = await upload.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"File too large: {upload.filename}. Max size: 5MB"
            )

        suffix = Path(upload.filename or "document").suffix or ".bin"
        stored_name = f"{uuid4().hex}{suffix}"
        stored_path = upload_dir / stored_name
        stored_path.write_bytes(contents)

        # Create document - let the database handle uploaded_at with DEFAULT NOW()
        document = EmployeeDocument(
            employee_id=employee_id,
            document_type=document_type,
            original_file_name=upload.filename or stored_name,
            stored_file_name=stored_name,
            file_path=str(stored_path),
            file_size=len(contents),
            mime_type=upload.content_type or "application/octet-stream",
            uploaded_by=current_user.id,
            # uploaded_at is removed - database will set it automatically
        )
        database.add(document)
        database.flush()
        database.refresh(document)
        created_documents.append(_document_to_read(document))

    database.commit()
    return created_documents


@router.get("/{employee_id}/documents", response_model=list[EmployeeDocumentRead])
def list_employee_documents(employee_id: UUID, database: Session = Depends(get_db)) -> list[EmployeeDocumentRead]:
    from app.models.employee_document import EmployeeDocument

    documents = database.scalars(
        select(EmployeeDocument)
        .where(EmployeeDocument.employee_id == employee_id)
        .order_by(EmployeeDocument.created_at.desc())  # Use created_at from TimestampMixin
    ).all()
    return [_document_to_read(document) for document in documents]


@router.get("/documents/{document_id}/download")
def download_employee_document(document_id: UUID, database: Session = Depends(get_db)):
    from fastapi.responses import FileResponse
    from app.models.employee_document import EmployeeDocument

    document = database.get(EmployeeDocument, document_id)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    return FileResponse(document.file_path, filename=document.original_file_name, media_type=document.mime_type)


@router.delete("/documents/{document_id}")
def delete_employee_document(document_id: UUID, database: Session = Depends(get_db)) -> dict[str, str]:
    from app.models.employee_document import EmployeeDocument
    from pathlib import Path

    document = database.get(EmployeeDocument, document_id)
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    # Delete file from disk
    Path(document.file_path).unlink(missing_ok=True)
    
    # Delete from database
    database.delete(document)
    database.commit()
    return {"deleted_id": str(document_id)}