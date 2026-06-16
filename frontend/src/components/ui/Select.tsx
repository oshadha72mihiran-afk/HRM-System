import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ className, label, id, children, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? undefined;

  return (
    <label className="block space-y-2 text-sm text-slate-200" htmlFor={selectId}>
      {label ? <span className="font-medium text-slate-300">{label}</span> : null}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-primary/60',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
