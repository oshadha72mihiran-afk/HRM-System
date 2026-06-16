export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ONBOARDING' | 'TERMINATED';

export type Employee = {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  status: EmployeeStatus;
};
