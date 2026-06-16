"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { Payroll, Employee } from "@/types";

const paymentStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);
  const [formData, setFormData] = useState({
    employee_id: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basic_salary: 0,
    allowances: 0,
    deductions: 0,
    payment_status: "PENDING",
  });

  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (item: Payroll) => {
        const emp = employees.find((e) => e.id === item.employee_id);
        return emp ? `${emp.first_name} ${emp.last_name}` : "Unknown";
      },
    },
    {
      key: "period",
      header: "Period",
      render: (item: Payroll) => `${item.month}/${item.year}`,
    },
    {
      key: "basic_salary",
      header: "Basic Salary",
      render: (item: Payroll) => `$${item.basic_salary.toFixed(2)}`,
    },
    {
      key: "net_salary",
      header: "Net Salary",
      render: (item: Payroll) => `$${item.net_salary.toFixed(2)}`,
    },
    {
      key: "payment_status",
      header: "Status",
      render: (item: Payroll) => {
        const statusMap: Record<
          string,
          {
            label: string;
            variant: "active" | "inactive" | "pending" | "paid" | "failed";
          }
        > = {
          PENDING: { label: "Pending", variant: "pending" },
          PAID: { label: "Paid", variant: "paid" },
          FAILED: { label: "Failed", variant: "failed" },
        };
        const status = statusMap[item.payment_status] || {
          label: item.payment_status,
          variant: "inactive",
        };
        return <StatusBadge status={status.label} variant={status.variant} />;
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [payrollsData, employeesData] = await Promise.all([
        api.get<Payroll[]>("/payrolls"),
        api.get<Employee[]>("/employees"),
      ]);
      setPayrolls(payrollsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPayroll) {
        await api.patch(`/payrolls/${editingPayroll.id}`, formData);
      } else {
        await api.post("/payrolls", formData);
      }
      setIsModalOpen(false);
      setEditingPayroll(null);
      setFormData({
        employee_id: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basic_salary: 0,
        allowances: 0,
        deductions: 0,
        payment_status: "PENDING",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to save payroll:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this payroll record?")) {
      try {
        await api.delete(`/payrolls/${id}`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete payroll:", error);
      }
    }
  };

  const employeeOptions = employees.map((e) => ({
    value: e.id,
    label: `${e.first_name} ${e.last_name} (${e.employee_code})`,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-stack-lg">
      <section className="flex justify-between items-end">
        <div>
          <h3 className="font-headline-lg text-headline-lg text-primary">
            Financial Operations
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Monitor and execute global payroll distributions with precision.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              // Run payroll action
              alert("Payroll run initiated!");
            }}
            className="flex items-center gap-3 bg-secondary text-on-secondary hover:brightness-110"
          >
            <span className="material-symbols-outlined">monetization_on</span>
            RUN PAYROLL
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3"
          >
            <span className="material-symbols-outlined">add</span>
            ADD RECORD
          </Button>
        </div>
      </section>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <Card className="p-6">
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
            Total Monthly Spend
          </p>
          <p className="font-headline-lg text-headline-lg text-primary mt-2">
            ${payrolls.reduce((sum, p) => sum + p.net_salary, 0).toFixed(2)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
            Total Employees
          </p>
          <p className="font-headline-lg text-headline-lg text-primary mt-2">
            {employees.length}
          </p>
        </Card>
        <Card className="p-6 border-t-2 border-secondary">
          <p className="font-label-md text-label-md text-secondary uppercase tracking-widest">
            Pending Payments
          </p>
          <p className="font-headline-lg text-headline-lg text-primary mt-2">
            {payrolls.filter((p) => p.payment_status === "PENDING").length}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={payrolls}
          onRowClick={(item) => {
            setEditingPayroll(item);
            setFormData({
              employee_id: item.employee_id,
              month: item.month,
              year: item.year,
              basic_salary: item.basic_salary,
              allowances: item.allowances,
              deductions: item.deductions,
              payment_status: item.payment_status,
            });
            setIsModalOpen(true);
          }}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPayroll(null);
          setFormData({
            employee_id: "",
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            basic_salary: 0,
            allowances: 0,
            deductions: 0,
            payment_status: "PENDING",
          });
        }}
        title={editingPayroll ? "Edit Payroll" : "Create Payroll"}
      >
        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <Select
            label="Employee"
            value={formData.employee_id}
            onChange={(e) =>
              setFormData({ ...formData, employee_id: e.target.value })
            }
            options={employeeOptions}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Month"
              type="number"
              min={1}
              max={12}
              value={formData.month}
              onChange={(e) =>
                setFormData({ ...formData, month: parseInt(e.target.value) })
              }
              required
            />
            <Input
              label="Year"
              type="number"
              min={2000}
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <Input
            label="Basic Salary"
            type="number"
            step="0.01"
            value={formData.basic_salary}
            onChange={(e) =>
              setFormData({
                ...formData,
                basic_salary: parseFloat(e.target.value),
              })
            }
            required
          />
          <Input
            label="Allowances"
            type="number"
            step="0.01"
            value={formData.allowances}
            onChange={(e) =>
              setFormData({
                ...formData,
                allowances: parseFloat(e.target.value),
              })
            }
          />
          <Input
            label="Deductions"
            type="number"
            step="0.01"
            value={formData.deductions}
            onChange={(e) =>
              setFormData({
                ...formData,
                deductions: parseFloat(e.target.value),
              })
            }
          />
          <Select
            label="Payment Status"
            value={formData.payment_status}
            onChange={(e) =>
              setFormData({ ...formData, payment_status: e.target.value })
            }
            options={paymentStatusOptions}
          />
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingPayroll(null);
                setFormData({
                  employee_id: "",
                  month: new Date().getMonth() + 1,
                  year: new Date().getFullYear(),
                  basic_salary: 0,
                  allowances: 0,
                  deductions: 0,
                  payment_status: "PENDING",
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingPayroll ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
