import React from "react";

interface StatusBadgeProps {
  status: string;
  variant?: "active" | "inactive" | "pending" | "paid" | "failed" | "overdue";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "active",
}) => {
  const variantStyles = {
    active: "bg-secondary/10 text-secondary",
    inactive: "bg-surface-container-high text-on-surface-variant",
    pending: "bg-outline-variant/20 text-on-surface-variant",
    paid: "bg-secondary/10 text-secondary",
    failed: "bg-error/10 text-error",
    overdue: "bg-error/10 text-error animate-pulse",
  };

  const dotStyles = {
    active: "bg-secondary",
    inactive: "bg-outline-variant",
    pending: "bg-outline-variant",
    paid: "bg-secondary",
    failed: "bg-error",
    overdue: "bg-error",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full
        font-label-md text-[10px] uppercase tracking-widest
        ${variantStyles[variant] || "bg-surface-container-high text-on-surface-variant"}
      `}
    >
      <span
        className={`w-1 h-1 rounded-full ${dotStyles[variant] || "bg-outline-variant"}`}
      />
      {status}
    </span>
  );
};
