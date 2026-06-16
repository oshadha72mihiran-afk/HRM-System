"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser, removeAuthToken } from "@/lib/auth";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Departments", href: "/departments", icon: "group" },
  { label: "Positions", href: "/positions", icon: "work" },
  { label: "Employees", href: "/employees", icon: "person" },
  { label: "Payroll", href: "/payroll", icon: "payments" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const user = getUser();

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  const handleSupport = () => {
    // Handle support action - could open a modal or navigate
    alert("Support section coming soon!");
  };

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col z-50 h-screen w-64 bg-primary-container border-r border-outline-variant shadow-sm transition-all duration-300 ease-in-out">
      <div className="p-8">
        <h1 className="font-headline-md text-headline-md font-semibold text-secondary">
          Aureate HRM
        </h1>
        <p className="font-label-md text-label-md text-on-primary-container mt-1">
          Enterprise Suite
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 transition-all
                ${
                  isActive
                    ? "bg-secondary-container/10 text-secondary font-semibold border-r-2 border-secondary"
                    : "text-on-surface-variant/70 hover:text-secondary hover:bg-secondary-container/5"
                }
              `}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant/30">
        <button
          onClick={() => router.push("/employees")}
          className="w-full py-3 bg-secondary text-on-secondary font-label-md text-label-md transition-all hover:brightness-110"
        >
          New Request
        </button>
        <div className="mt-6 space-y-1">
          {/* Fix: Use button instead of Link for non-navigation actions */}
          <button
            onClick={handleSupport}
            className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/70 hover:text-secondary transition-colors w-full"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md text-label-md">Support</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-on-surface-variant/70 hover:text-error transition-colors w-full"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};