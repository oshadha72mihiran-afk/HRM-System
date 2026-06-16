// frontend/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";

export function Navbar() {
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <header className="bg-surface border-b border-outline-variant/30 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Executive Dashboard
        </h2>
        <p className="text-caption text-on-surface-variant">
          Enterprise HRM Suite
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant/50 hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold text-sm">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="font-body-md text-on-surface">
              {user?.full_name || "User"}
            </p>
            <p className="text-caption text-on-surface-variant">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
