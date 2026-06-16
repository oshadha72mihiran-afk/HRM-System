import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/cn';

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ className, children }: CardProps) {
  return <section className={cn('rounded-3xl border border-white/10 bg-panel p-6 shadow-soft', className)}>{children}</section>;
}
