"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { setAuthToken, setUser } from "@/lib/auth";
import { LoginResponse } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      setAuthToken(response.token.access_token);
      setUser(response.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-background">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary-container/10 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-[480px]">
        <header className="text-center mb-stack-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="font-headline-md text-headline-md font-semibold text-secondary mb-2">
            Aureate HRM
          </h1>
          <p className="font-label-md text-label-md text-on-surface-variant tracking-[0.2em] uppercase">
            Enterprise Suite
          </p>
        </header>

        <div className="bg-white p-10 md:p-12 rounded-lg animate-in fade-in zoom-in-95 duration-1000 luxury-shadow border border-surface-container">
          <div className="mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">
              Welcome Back
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Access your executive dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <Input
              label="Corporate Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="executive@aureate.com"
              required
              icon={<span className="material-symbols-outlined">mail</span>}
            />

            <Input
              label="Secure Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              icon={<span className="material-symbols-outlined">lock</span>}
            />

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <label
                  htmlFor="remember"
                  className="font-body-md text-body-md text-on-surface-variant cursor-pointer"
                >
                  Stay signed in
                </label>
              </div>
              <Link
                href="#"
                className="font-label-md text-label-md text-secondary hover:text-on-secondary-container transition-colors"
              >
                Forgot?
              </Link>
            </div>

            {error && (
              <p className="font-caption text-caption text-error">{error}</p>
            )}

            <div className="pt-stack-md">
              <Button
                type="submit"
                fullWidth
                loading={loading}
                className="py-4 shadow-lg shadow-primary/10"
              >
                Sign In to Workspace
              </Button>
            </div>
          </form>

          <div className="mt-stack-lg pt-stack-md border-t border-outline-variant/20 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              New to the suite?{" "}
              <Link
                href="/register"
                className="text-secondary font-semibold hover:underline underline-offset-4 decoration-secondary-container"
              >
                Request Access
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-stack-lg flex justify-between items-center px-4 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            <span className="font-caption text-caption text-on-surface-variant/60 tracking-wider uppercase">
              Systems Operational
            </span>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant/40">
              encrypted
            </span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant/40">
              fingerprint
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}
