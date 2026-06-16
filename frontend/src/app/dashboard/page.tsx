import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';

const stats = [
  { label: 'Total employees', value: '128' },
  { label: 'Departments', value: '12' },
  { label: 'Positions', value: '38' },
  { label: 'Monthly payroll', value: '$84,200' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-caption uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            <p className="mt-3 font-heading text-3xl font-bold text-white">{stat.value}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-heading text-subheading text-white">Recent employees</h2>
          <p className="mt-3 text-sm text-slate-300">This section will pull live employee data from the API.</p>
        </Card>
        <Card>
          <h2 className="font-heading text-subheading text-white">Pending payrolls</h2>
          <p className="mt-3 text-sm text-slate-300">This section will show outstanding payroll items.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
