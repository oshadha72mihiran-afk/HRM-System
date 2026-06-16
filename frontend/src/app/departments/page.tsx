"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { Department } from "@/types";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const columns = [
    { key: "name", header: "Department Name" },
    { key: "description", header: "Description" },
    {
      key: "is_active",
      header: "Status",
      render: (item: Department) => (
        <StatusBadge
          status={item.is_active ? "Active" : "Inactive"}
          variant={item.is_active ? "active" : "inactive"}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await api.get<Department[]>("/departments");
      setDepartments(data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await api.patch(`/departments/${editingDepartment.id}`, formData);
      } else {
        await api.post("/departments", formData);
      }
      setIsModalOpen(false);
      setEditingDepartment(null);
      setFormData({ name: "", description: "", is_active: true });
      fetchDepartments();
    } catch (error) {
      console.error("Failed to save department:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await api.delete(`/departments/${id}`);
        fetchDepartments();
      } catch (error) {
        console.error("Failed to delete department:", error);
      }
    }
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
      is_active: department.is_active,
    });
    setIsModalOpen(true);
  };

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
            Departmental Structures
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Refined oversight of organizational hierarchy, reporting lines, and
            resource allocation across the enterprise suite.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3"
        >
          <span className="material-symbols-outlined">account_tree</span>
          NEW DEPARTMENT
        </Button>
      </section>

      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={departments}
          onRowClick={(item) => handleEdit(item)}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDepartment(null);
          setFormData({ name: "", description: "", is_active: true });
        }}
        title={editingDepartment ? "Edit Department" : "Create Department"}
      >
        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <Input
            label="Department Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <label
              htmlFor="is_active"
              className="font-body-md text-body-md text-on-surface-variant"
            >
              Active
            </label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingDepartment(null);
                setFormData({ name: "", description: "", is_active: true });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingDepartment ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
