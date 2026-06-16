import type { PropsWithChildren } from 'react';

type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
}>;

export function Modal({ open, title, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-surface p-6 shadow-soft">
        <h2 className="font-heading text-2xl font-semibold text-white">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
