// frontend/types/employee.ts
export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  department_id: string;
  position_id: string;
  joining_date: string;
  employment_type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  basic_salary: number;
  status: "ACTIVE" | "INACTIVE" | "ONBOARDING" | "TERMINATED";
  created_at: string;
  updated_at: string;
}

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  document_type:
    | "NIC_ID_COPY"
    | "PASSPORT_COPY"
    | "CV_RESUME"
    | "EDUCATION_CERTIFICATE"
    | "PREVIOUS_EMPLOYMENT_LETTER"
    | "BANK_DETAILS"
    | "SIGNED_CONTRACT"
    | "OTHER";
  original_file_name: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}
