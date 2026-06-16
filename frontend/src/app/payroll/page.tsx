import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';

export default function PayrollPage() {
  return (
    <DashboardLayout>
      <Card className="space-y-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Payroll</h1>
          <p className="mt-2 text-sm text-slate-300">Track salary processing and payment status.</p>
        </div>
        <Table headers={["Employee", "Month", "Net Salary", "Status"]} rows={[]} emptyState="No payroll records yet." />
      </Card>
    </DashboardLayout>
  );
}
