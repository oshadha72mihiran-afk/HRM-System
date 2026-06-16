"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { api } from "@/lib/api";
import { setAuthToken, setUser } from "@/lib/auth";
import { LoginResponse } from "@/types";

const roleOptions = [
  { value: "HR", label: "HR" },
  { value: "MANAGER", label: "Manager" },
  { value: "EMPLOYEE", label: "Employee" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "HR",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginResponse>(
        "/auth/register",
        formData,
      );
      setAuthToken(response.token.access_token);
      setUser(response.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left Side: Branding */}
      <section className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-primary-container overflow-hidden">
        <div className="absolute inset-0 img-overlay flex flex-col justify-between p-margin-desktop z-10 bg-gradient-to-b from-primary-container/60 to-primary-container/80">
          <div>
            <h1 className="font-headline-md text-headline-md italic text-white tracking-tight">
              Aureate
            </h1>
            <p className="font-label-md text-label-md text-white/60 tracking-widest mt-unit">
              EXECUTIVE HRM
            </p>
          </div>
          <div className="max-w-md">
            <h2 className="font-display-lg text-display-lg text-white mb-stack-sm">
              The Pinnacle of Human Capital.
            </h2>
            <p className="font-body-lg text-body-lg text-white/80 border-l-2 border-secondary pl-stack-sm">
              Experience the quiet confidence of a management suite designed for
              the world's most discerning organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side: Registration Form */}
      <section className="flex-1 flex flex-col justify-center items-center px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-stack-lg bg-surface">
        <div className="md:hidden w-full max-w-md mb-stack-lg">
          <h1 className="font-headline-md text-headline-md italic text-primary">
            Aureate Executive
          </h1>
        </div>

        <div className="w-full max-w-md space-y-stack-lg">
          <div className="space-y-stack-sm">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Begin your journey
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Create your enterprise account to access the premium HRM suite.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <Input
              label="FULL NAME"
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Arthur P. Sterling"
              required
            />

            <Input
              label="PROFESSIONAL EMAIL"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="sterling@enterprise.com"
              required
            />

            <Select
              label="ROLE"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              options={roleOptions}
            />

            <Input
              label="SECURE PASSWORD"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••••••"
              required
              minLength={8}
            />

            <div className="pt-stack-sm">
              <div className="flex items-center gap-stack-sm mb-stack-md">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded-sm border-outline-variant text-primary focus:ring-primary"
                  required
                />
                <label
                  className="font-caption text-caption text-on-surface-variant"
                  htmlFor="terms"
                >
                  I agree to the{" "}
                  <Link href="#" className="text-secondary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-secondary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {error && (
                <p className="font-caption text-caption text-error">{error}</p>
              )}

              <Button
                type="submit"
                fullWidth
                loading={loading}
                className="py-4"
              >
                Initialize Account
              </Button>
            </div>
          </form>

          <div className="text-center pt-stack-sm">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-secondary transition-colors underline underline-offset-4 decoration-secondary/30"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-auto pt-stack-lg hidden md:block">
          <p className="font-caption text-caption text-on-surface-variant/40 uppercase tracking-widest">
            © 2024 Aureate Global Holdings. All Rights Reserved.
          </p>
        </div>
      </section>
    </main>
  );
}
