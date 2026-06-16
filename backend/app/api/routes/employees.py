from fastapi import APIRouter

from app.schemas.employee import EmployeeCreate, EmployeeDocumentRead, EmployeeRead, EmployeeUpdate

router = APIRouter()


@router.post("", response_model=EmployeeRead)
def create_employee(payload: EmployeeCreate) -> EmployeeRead:
    return EmployeeRead(id=1, **payload.model_dump())


@router.get("", response_model=list[EmployeeRead])
def list_employees() -> list[EmployeeRead]:
    return []


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(employee_id: int) -> EmployeeRead:
    return EmployeeRead(
        id=employee_id,
        employee_code="EMP-001",
        first_name="Jane",
        last_name="Doe",
        email="jane@example.com",
        phone=None,
        address=None,
        department_id=1,
        position_id=1,
        joining_date=None,
        employment_type="FULL_TIME",
        basic_salary=1000,
        status="ONBOARDING",
    )


@router.patch("/{employee_id}", response_model=EmployeeRead)
def update_employee(employee_id: int, payload: EmployeeUpdate) -> EmployeeRead:
    data = {
        "employee_code": "EMP-001",
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "phone": None,
        "address": None,
        "department_id": 1,
        "position_id": 1,
        "joining_date": None,
        "employment_type": "FULL_TIME",
        "basic_salary": 1000,
        "status": "ONBOARDING",
    }
    data.update(payload.model_dump(exclude_unset=True))
    return EmployeeRead(id=employee_id, **data)


@router.delete("/{employee_id}")
def delete_employee(employee_id: int) -> dict[str, int]:
    return {"deleted_id": employee_id}


@router.post("/{employee_id}/documents", response_model=EmployeeDocumentRead)
def upload_employee_document(employee_id: int) -> EmployeeDocumentRead:
    return EmployeeDocumentRead(
        id=1,
        employee_id=employee_id,
        document_type="CV",
        original_file_name="resume.pdf",
        stored_file_name="resume_1.pdf",
        file_path="uploads/resume_1.pdf",
        file_size=1024,
        mime_type="application/pdf",
        uploaded_by=1,
    )


@router.get("/{employee_id}/documents", response_model=list[EmployeeDocumentRead])
def list_employee_documents(employee_id: int) -> list[EmployeeDocumentRead]:
    return []


@router.get("/documents/{document_id}/download")
def download_employee_document(document_id: int) -> dict[str, int]:
    return {"document_id": document_id}


@router.delete("/documents/{document_id}")
def delete_employee_document(document_id: int) -> dict[str, int]:
    return {"deleted_id": document_id}
