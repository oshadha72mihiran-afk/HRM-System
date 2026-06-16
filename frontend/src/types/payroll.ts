export type PayrollStatus = 'PENDING' | 'PAID' | 'FAILED';

export type Payroll = {
  id: number;
  employee_id: number;
  month: number;
  year: number;
  net_salary: number;
  payment_status: PayrollStatus;
};
