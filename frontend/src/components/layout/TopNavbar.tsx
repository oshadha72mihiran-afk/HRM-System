"use client";

import React from "react";
import { getUser } from "@/lib/auth";

export const TopNavbar: React.FC = () => {
  const user = getUser();

  return (
    <header className="flex justify-between items-center h-20 px-margin-desktop sticky top-0 z-40 bg-surface border-b border-surface-container shadow-sm">
      <div className="flex items-center gap-12">
        <h2 className="font-headline-md text-headline-md italic text-primary">
          Aureate Executive
        </h2>
        <div className="relative group hidden lg:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">
            search
          </span>
          <input
            className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 w-64 font-body-md text-body-md focus:ring-1 focus:ring-secondary/30 transition-all"
            placeholder="Search records..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <span className="material-symbols-outlined">history</span>
          </button>
          <button className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-label-md text-label-md text-primary">
              {user?.full_name || "User"}
            </p>
            <p className="font-caption text-caption text-on-surface-variant uppercase tracking-tighter">
              {user?.role || "Employee"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary font-semibold">
            {user?.full_name?.charAt(0) || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};
