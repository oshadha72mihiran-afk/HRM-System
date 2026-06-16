import { cn } from '@/lib/cn';

type StatusBadgeProps = {
  status: string;
};

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-success/15 text-success border-success/20',
  INACTIVE: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  ONBOARDING: 'bg-warning/15 text-warning border-warning/20',
  TERMINATED: 'bg-danger/15 text-danger border-danger/20',
  PENDING: 'bg-warning/15 text-warning border-warning/20',
  PAID: 'bg-success/15 text-success border-success/20',
  FAILED: 'bg-danger/15 text-danger border-danger/20',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]', statusStyles[status] ?? 'bg-white/10 text-slate-200 border-white/10')}>{status}</span>;
}
