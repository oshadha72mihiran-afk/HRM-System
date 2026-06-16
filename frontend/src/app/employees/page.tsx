import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { FileUpload } from '@/components/ui/FileUpload';

export default function EmployeesPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="space-y-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white">Employee onboarding</h1>
            <p className="mt-2 text-sm text-slate-300">Capture employee details and supporting documents.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-24 rounded-2xl border border-white/10 bg-white/5" />
            <div className="h-24 rounded-2xl border border-white/10 bg-white/5" />
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-heading text-subheading text-white">Document upload</h2>
          <FileUpload />
        </Card>
      </div>
    </DashboardLayout>
  );
}
