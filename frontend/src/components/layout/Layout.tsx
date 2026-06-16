"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { isAuthenticated } from "@/lib/auth";

const publicPaths = ["/login", "/register"];

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = publicPaths.includes(pathname || "");

  useEffect(() => {
    if (!isPublic && !isAuthenticated()) {
      router.push("/login");
    }
    if (isPublic && isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [isPublic, router]);

  if (isPublic) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <TopNavbar />
        <main className="p-margin-desktop max-w-container-max mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
