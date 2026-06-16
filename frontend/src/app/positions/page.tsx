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
import { Position, Department } from "@/types";

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [formData, setFormData] = useState({
    department_id: "",
    title: "",
    description: "",
    is_active: true,
  });

  const columns = [
    { key: "title", header: "Position Title" },
    {
      key: "department_id",
      header: "Department",
      render: (item: Position) => {
        const dept = departments.find((d) => d.id === item.department_id);
        return dept?.name || "Unknown";
      },
    },
    { key: "description", header: "Description" },
    {
      key: "is_active",
      header: "Status",
      render: (item: Position) => (
        <StatusBadge
          status={item.is_active ? "Active" : "Inactive"}
          variant={item.is_active ? "active" : "inactive"}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [positionsData, departmentsData] = await Promise.all([
        api.get<Position[]>("/positions"),
        api.get<Department[]>("/departments"),
      ]);
      setPositions(positionsData);
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPosition) {
        await api.patch(`/positions/${editingPosition.id}`, formData);
      } else {
        await api.post("/positions", formData);
      }
      setIsModalOpen(false);
      setEditingPosition(null);
      setFormData({
        department_id: "",
        title: "",
        description: "",
        is_active: true,
      });
      fetchData();
    } catch (error) {
      console.error("Failed to save position:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this position?")) {
      try {
        await api.delete(`/positions/${id}`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete position:", error);
      }
    }
  };

  const departmentOptions = departments.map((d) => ({
    value: d.id,
    label: d.name,
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
            Positions Management
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Review and manage organizational hierarchies, role specifications,
            and executive compensation brackets across global departments.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3"
        >
          <span className="material-symbols-outlined">add</span>
          CREATE POSITION
        </Button>
      </section>

      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={positions}
          onRowClick={(item) => {
            setEditingPosition(item);
            setFormData({
              department_id: item.department_id,
              title: item.title,
              description: item.description || "",
              is_active: item.is_active,
            });
            setIsModalOpen(true);
          }}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPosition(null);
          setFormData({
            department_id: "",
            title: "",
            description: "",
            is_active: true,
          });
        }}
        title={editingPosition ? "Edit Position" : "Create Position"}
      >
        <form onSubmit={handleSubmit} className="space-y-stack-md">
          <Select
            label="Department"
            value={formData.department_id}
            onChange={(e) =>
              setFormData({ ...formData, department_id: e.target.value })
            }
            options={departmentOptions}
            required
          />
          <Input
            label="Position Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
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
                setEditingPosition(null);
                setFormData({
                  department_id: "",
                  title: "",
                  description: "",
                  is_active: true,
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingPosition ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
