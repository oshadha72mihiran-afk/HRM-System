import type { ReactNode } from 'react';

type TableProps = {
  headers: string[];
  rows: ReactNode[][];
  emptyState?: string;
};

export function Table({ headers, rows, emptyState = 'No records found.' }: TableProps) {
  if (rows.length === 0) {
    return <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-sm text-slate-400">{emptyState}</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full text-left text-sm text-slate-200">
        <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-400">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-5 py-4 font-medium">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-white/10">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-5 py-4">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
