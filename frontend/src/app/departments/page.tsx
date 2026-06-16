import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';

export default function DepartmentsPage() {
  return (
    <DashboardLayout>
      <Card className="space-y-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Departments</h1>
          <p className="mt-2 text-sm text-slate-300">Master data management for departments.</p>
        </div>
        <Table headers={["Name", "Description", "Status"]} rows={[]} emptyState="No departments yet." />
      </Card>
    </DashboardLayout>
  );
}
