import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/departments', label: 'Departments' },
  { href: '/positions', label: 'Positions' },
  { href: '/employees', label: 'Employees' },
  { href: '/payroll', label: 'Payroll' },
] as const;

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-surface/90 p-6 lg:block">
      <div className="space-y-1">
        <p className="font-heading text-2xl font-bold text-white">HRM System</p>
        <p className="text-sm text-slate-400">Operations workspace</p>
      </div>
      <nav className="mt-10 space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
