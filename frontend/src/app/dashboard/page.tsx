"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { api } from "@/lib/api";
import { Employee, Department } from "@/types";

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  positionsFilled: number;
  monthlyPayroll: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalDepartments: 0,
    positionsFilled: 0,
    monthlyPayroll: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [employees, departments] = await Promise.all([
          api.get<Employee[]>("/employees"),
          api.get<Department[]>("/departments"),
        ]);

        setRecentEmployees(employees.slice(0, 5));
        setStats({
          totalEmployees: employees.length,
          totalDepartments: departments.length,
          positionsFilled: 92,
          monthlyPayroll: 4200000,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const employeeColumns = [
    { key: "full_name", header: "Full Name" },
    { key: "email", header: "Email" },
    { key: "department", header: "Department" },
    { key: "status", header: "Status" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-stack-lg">
      {/* Welcome Header */}
      <section className="mb-stack-lg">
        <h3 className="font-headline-lg text-headline-lg text-primary mb-2">
          Executive Insights
        </h3>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Overview of enterprise performance, workforce distribution, and
          payroll liquidity for the current fiscal period.
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <Card className="p-8 flex flex-col gap-2">
          <span className="font-label-md text-label-md text-on-surface-variant tracking-widest uppercase">
            Total Employees
          </span>
          <span className="font-display-lg text-display-lg text-primary">
            {stats.totalEmployees}
          </span>
          <div className="flex items-center gap-1 text-secondary mt-2">
            <span className="material-symbols-outlined text-[16px]">
              trending_up
            </span>
            <span className="font-caption text-caption">
              4.2% growth this month
            </span>
          </div>
        </Card>

        <Card className="p-8 flex flex-col gap-2">
          <span className="font-label-md text-label-md text-on-surface-variant tracking-widest uppercase">
            Total Departments
          </span>
          <span className="font-display-lg text-display-lg text-primary">
            {stats.totalDepartments}
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant mt-2">
            <span className="material-symbols-outlined text-[16px]">
              account_tree
            </span>
            <span className="font-caption text-caption">
              No structural changes
            </span>
          </div>
        </Card>

        <Card className="p-8 flex flex-col gap-2">
          <span className="font-label-md text-label-md text-on-surface-variant tracking-widest uppercase">
            Positions Filled
          </span>
          <span className="font-display-lg text-display-lg text-primary">
            {stats.positionsFilled}
            <span className="text-headline-md text-on-surface-variant/40">
              %
            </span>
          </span>
          <div className="flex items-center gap-1 text-error mt-2">
            <span className="material-symbols-outlined text-[16px]">
              trending_down
            </span>
            <span className="font-caption text-caption">
              8 vacancies remaining
            </span>
          </div>
        </Card>

        <Card className="p-8 flex flex-col gap-2 border-t-2 border-secondary">
          <span className="font-label-md text-label-md text-secondary tracking-widest uppercase">
            Monthly Payroll Total
          </span>
          <span className="font-display-lg text-display-lg text-primary">
            ${(stats.monthlyPayroll / 1000000).toFixed(1)}M
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant mt-2">
            <span className="material-symbols-outlined text-[16px]">
              schedule
            </span>
            <span className="font-caption text-caption">
              Next cycle in 4 days
            </span>
          </div>
        </Card>
      </div>

      {/* Recent Employees */}
      <Card className="overflow-hidden">
        <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center">
          <h4 className="font-headline-md text-headline-md text-primary">
            Recent Employees
          </h4>
          <button className="text-secondary font-label-md text-label-md flex items-center gap-1 hover:underline">
            View Directory{" "}
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        </div>
        <Table
          columns={employeeColumns}
          data={recentEmployees}
          onRowClick={(employee) => console.log("Clicked employee:", employee)}
        />
      </Card>
    </div>
  );
}
