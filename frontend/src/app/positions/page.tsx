import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';

export default function PositionsPage() {
  return (
    <DashboardLayout>
      <Card className="space-y-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Positions</h1>
          <p className="mt-2 text-sm text-slate-300">Manage department-linked job positions.</p>
        </div>
        <Table headers={["Department", "Title", "Status"]} rows={[]} emptyState="No positions yet." />
      </Card>
    </DashboardLayout>
  );
}
