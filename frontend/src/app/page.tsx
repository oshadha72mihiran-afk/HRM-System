import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <section className="grid w-full gap-8 rounded-3xl border border-white/10 bg-surface/90 p-8 shadow-soft backdrop-blur md:grid-cols-[1.2fr_0.8fr] md:p-12">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-caption font-medium text-primary">
            HRM System scaffold
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight text-white md:text-6xl">
            Build employee operations with a clean, structured workflow.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            This starter sets up the frontend, backend, reusable UI components, custom Tailwind theme values, and the initial route structure for the HRM system.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryHover" href="/login">
              Open login
            </Link>
            <Link className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-primary/50 hover:text-white" href="/dashboard">
              View dashboard
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-panel p-6 shadow-glow">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Included screens</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            <li>Login and register</li>
            <li>Dashboard</li>
            <li>Departments and positions</li>
            <li>Employee onboarding with document upload</li>
            <li>Payroll management</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
