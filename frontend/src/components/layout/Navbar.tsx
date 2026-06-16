export function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Overview</p>
        <h1 className="font-heading text-2xl font-semibold text-white">Human resource management</h1>
      </div>
      <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">Admin</div>
    </header>
  );
}
