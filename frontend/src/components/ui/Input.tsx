import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ className, label, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? undefined;

  return (
    <label className="block space-y-2 text-sm text-slate-200" htmlFor={inputId}>
      {label ? <span className="font-medium text-slate-300">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-primary/60 focus:bg-white/7',
          className,
        )}
        {...props}
      />
    </label>
  );
}
