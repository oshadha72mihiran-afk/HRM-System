"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileUpload } from "@/components/ui/FileUpload";
import { api } from "@/lib/api";
import { Employee, Department, Position, EmployeeDocument } from "@/types";

const employmentTypeOptions = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "ONBOARDING", label: "Onboarding" },
  { value: "TERMINATED", label: "Terminated" },
];

const documentTypeOptions = [
  { value: "NIC_ID_COPY", label: "NIC/ID Copy" },
  { value: "PASSPORT_COPY", label: "Passport Copy" },
  { value: "CV_RESUME", label: "CV/Resume" },
  { value: "EDUCATION_CERTIFICATE", label: "Education Certificate" },
  { value: "BANK_DETAILS", label: "Bank Details" },
  { value: "SIGNED_CONTRACT", label: "Signed Contract" },
  { value: "OTHER", label: "Other" },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [formData, setFormData] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    department_id: "",
    position_id: "",
    joining_date: "",
    employment_type: "FULL_TIME",
    basic_salary: 0,
    status: "ONBOARDING",
  });
  const [documentType, setDocumentType] = useState("OTHER");

  const columns = [
    {
      key: "full_name",
      header: "Employee",
      render: (item: Employee) => `${item.first_name} ${item.last_name}`,
    },
    { key: "employee_code", header: "Code" },
    { key: "email", header: "Email" },
    {
      key: "department_id",
      header: "Department",
      render: (item: Employee) => {
        const dept = departments.find((d) => d.id === item.department_id);
        return dept?.name || "-";
      },
    },
    {
      key: "status",
      header: "Status",
      render: (item: Employee) => (
        <StatusBadge
          status={item.status}
          variant={item.status === "ACTIVE" ? "active" : "inactive"}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [employeesData, departmentsData, positionsData] = await Promise.all(
        [
          api.get<Employee[]>("/employees"),
          api.get<Department[]>("/departments"),
          api.get<Position[]>("/positions"),
        ],
      );
      setEmployees(employeesData);
      setDepartments(departmentsData);
      setPositions(positionsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (employeeId: string) => {
    try {
      const data = await api.get<EmployeeDocument[]>(
        `/employees/${employeeId}/documents`,
      );
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.patch(`/employees/${editingEmployee.id}`, formData);
      } else {
        await api.post("/employees", formData);
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      setFormData({
        employee_code: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        department_id: "",
        position_id: "",
        joining_date: "",
        employment_type: "FULL_TIME",
        basic_salary: 0,
        status: "ONBOARDING",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to save employee:", error);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!selectedEmployeeId) return;
    try {
      await api.post(
        `/employees/${selectedEmployeeId}/documents`,
        { files, document_type: documentType },
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      fetchDocuments(selectedEmployeeId);
    } catch (error) {
      console.error("Failed to upload documents:", error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await api.delete(`/employees/documents/${documentId}`);
        if (selectedEmployeeId) fetchDocuments(selectedEmployeeId);
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
  };

  const departmentOptions = departments.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const positionOptions = positions.map((p) => ({
    value: p.id,
    label: p.title,
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
            Employee Management
          </h3>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Manage employee records, onboarding, and document management.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3"
        >
          <span className="material-symbols-outlined">person_add</span>
          ADD EMPLOYEE
        </Button>
      </section>

      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={employees}
          onRowClick={(item) => {
            setSelectedEmployeeId(item.id);
            fetchDocuments(item.id);
            setIsDocumentModalOpen(true);
          }}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
          setFormData({
            employee_code: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address: "",
            department_id: "",
            position_id: "",
            joining_date: "",
            employment_type: "FULL_TIME",
            basic_salary: 0,
            status: "ONBOARDING",
          });
        }}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-stack-md max-h-[70vh] overflow-y-auto"
        >
          <Input
            label="Employee Code"
            value={formData.employee_code}
            onChange={(e) =>
              setFormData({ ...formData, employee_code: e.target.value })
            }
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              required
            />
            <Input
              label="Last Name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              required
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <Select
            label="Department"
            value={formData.department_id}
            onChange={(e) =>
              setFormData({ ...formData, department_id: e.target.value })
            }
            options={departmentOptions}
          />
          <Select
            label="Position"
            value={formData.position_id}
            onChange={(e) =>
              setFormData({ ...formData, position_id: e.target.value })
            }
            options={positionOptions}
          />
          <Input
            label="Joining Date"
            type="date"
            value={formData.joining_date}
            onChange={(e) =>
              setFormData({ ...formData, joining_date: e.target.value })
            }
            required
          />
          <Select
            label="Employment Type"
            value={formData.employment_type}
            onChange={(e) =>
              setFormData({ ...formData, employment_type: e.target.value })
            }
            options={employmentTypeOptions}
          />
          <Input
            label="Basic Salary"
            type="number"
            value={formData.basic_salary}
            onChange={(e) =>
              setFormData({
                ...formData,
                basic_salary: parseFloat(e.target.value),
              })
            }
            required
          />
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            options={statusOptions}
          />
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingEmployee(null);
                setFormData({
                  employee_code: "",
                  first_name: "",
                  last_name: "",
                  email: "",
                  phone: "",
                  address: "",
                  department_id: "",
                  position_id: "",
                  joining_date: "",
                  employment_type: "FULL_TIME",
                  basic_salary: 0,
                  status: "ONBOARDING",
                });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingEmployee ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDocumentModalOpen}
        onClose={() => {
          setIsDocumentModalOpen(false);
          setSelectedEmployeeId(null);
          setDocuments([]);
        }}
        title="Employee Documents"
        size="lg"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <Select
              label="Document Type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              options={documentTypeOptions}
            />
            <FileUpload
              onFilesSelected={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5 * 1024 * 1024}
              label="Upload Documents"
            />
          </div>

          {documents.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-headline-md text-headline-md text-primary">
                Uploaded Documents
              </h4>
              <div className="divide-y divide-surface-container">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-body-md text-body-md text-primary">
                        {doc.original_file_name}
                      </p>
                      <p className="font-caption text-caption text-on-surface-variant">
                        {(doc.file_size / 1024).toFixed(1)} KB •{" "}
                        {doc.document_type}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/employees/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:text-secondary-fixed-dim transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          download
                        </span>
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-error hover:text-error-container transition-colors"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
