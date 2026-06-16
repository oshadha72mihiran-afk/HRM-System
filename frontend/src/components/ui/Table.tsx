import React from "react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  className = "",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left ${className}`}>
        <thead className="bg-surface-container-low/30">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-8 py-4 font-label-md text-label-md text-on-surface-variant/70 uppercase tracking-widest border-b border-surface-container"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={`
                hover:bg-secondary-container/5 transition-colors
                ${onRowClick ? "cursor-pointer" : ""}
              `}
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-8 py-5 ${col.className || ""}`}
                >
                  {col.render ? col.render(item) : String(item[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
