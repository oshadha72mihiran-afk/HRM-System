// frontend/types/payroll.ts
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
