export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";
  is_active: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface Position {
  id: string;
  department_id: string;
  title: string;
  description: string | null;
  is_active: boolean;
}

export interface Employee {
  id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  department_id: string | null;
  position_id: string | null;
  joining_date: string;
  employment_type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  basic_salary: number;
  status: "ACTIVE" | "INACTIVE" | "ONBOARDING" | "TERMINATED";
}

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  document_type: string;
  original_file_name: string;
  stored_file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface Payroll {
  id: string;
  employee_id: string;
  month: number;
  year: number;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  payment_status: "PENDING" | "PAID" | "FAILED";
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: {
    access_token: string;
    token_type: string;
  };
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role: "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";
}

export interface ApiError {
  detail: string;
}
