"""initial schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-06-16 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


user_role = postgresql.ENUM("ADMIN", "HR", "MANAGER", "EMPLOYEE", name="user_role", create_type=False)
employment_type = postgresql.ENUM("FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", name="employment_type", create_type=False)
employee_status = postgresql.ENUM("ACTIVE", "INACTIVE", "ONBOARDING", "TERMINATED", name="employee_status", create_type=False)
payment_status = postgresql.ENUM("PENDING", "PAID", "FAILED", name="payment_status", create_type=False)
document_type = postgresql.ENUM(
    "NIC_ID_COPY",
    "PASSPORT_COPY",
    "CV_RESUME",
    "EDUCATION_CERTIFICATE",
    "PREVIOUS_EMPLOYMENT_LETTER",
    "BANK_DETAILS",
    "SIGNED_CONTRACT",
    "OTHER",
    name="document_type",
    create_type=False,
)


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')
    user_role.create(op.get_bind(), checkfirst=True)
    employment_type.create(op.get_bind(), checkfirst=True)
    employee_status.create(op.get_bind(), checkfirst=True)
    payment_status.create(op.get_bind(), checkfirst=True)
    document_type.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("role", user_role, nullable=False, server_default=sa.text("'HR'::user_role")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("TRUE")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
    )
    op.create_index("idx_users_email", "users", ["email"], unique=False)

    op.create_table(
        "departments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(length=255), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("TRUE")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
    )
    op.create_index("idx_departments_is_active", "departments", ["is_active"], unique=False)

    op.create_table(
        "positions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("department_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("departments.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("TRUE")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.UniqueConstraint("department_id", "title", name="uq_position_title_department"),
    )
    op.create_index("idx_positions_department_id", "positions", ["department_id"], unique=False)

    op.create_table(
        "employees",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("employee_code", sa.String(length=50), nullable=False, unique=True),
        sa.Column("first_name", sa.String(length=100), nullable=False),
        sa.Column("last_name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("phone", sa.String(length=30), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("department_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("departments.id", ondelete="SET NULL"), nullable=True),
        sa.Column("position_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("positions.id", ondelete="SET NULL"), nullable=True),
        sa.Column("joining_date", sa.Date(), nullable=False),
        sa.Column("employment_type", employment_type, nullable=False, server_default=sa.text("'FULL_TIME'::employment_type")),
        sa.Column("basic_salary", sa.Numeric(12, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("status", employee_status, nullable=False, server_default=sa.text("'ONBOARDING'::employee_status")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
    )
    op.create_index("idx_employees_department_id", "employees", ["department_id"], unique=False)
    op.create_index("idx_employees_position_id", "employees", ["position_id"], unique=False)
    op.create_index("idx_employees_status", "employees", ["status"], unique=False)

    op.create_table(
        "employee_documents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("employee_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("employees.id", ondelete="CASCADE"), nullable=False),
        sa.Column("document_type", document_type, nullable=False, server_default=sa.text("'OTHER'::document_type")),
        sa.Column("original_file_name", sa.String(length=500), nullable=False),
        sa.Column("stored_file_name", sa.String(length=500), nullable=False, unique=True),
        sa.Column("file_path", sa.Text(), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("mime_type", sa.String(length=100), nullable=False),
        sa.Column("uploaded_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.CheckConstraint("file_size > 0 AND file_size <= 5242880", name="chk_employee_documents_file_size"),
        sa.CheckConstraint("mime_type IN ('application/pdf', 'image/jpeg', 'image/jpg', 'image/png')", name="chk_employee_documents_mime_type"),
    )
    op.create_index("idx_employee_documents_employee", "employee_documents", ["employee_id"], unique=False)

    op.create_table(
        "payrolls",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("employee_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("employees.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("month", sa.SmallInteger(), nullable=False),
        sa.Column("year", sa.SmallInteger(), nullable=False),
        sa.Column("basic_salary", sa.Numeric(12, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("allowances", sa.Numeric(12, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("deductions", sa.Numeric(12, 2), nullable=False, server_default=sa.text("0")),
        sa.Column("net_salary", sa.Numeric(12, 2), sa.Computed("basic_salary + allowances - deductions", persisted=True), nullable=False),
        sa.Column("payment_status", payment_status, nullable=False, server_default=sa.text("'PENDING'::payment_status")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.CheckConstraint("month BETWEEN 1 AND 12", name="chk_payroll_month"),
        sa.CheckConstraint("year >= 2000", name="chk_payroll_year"),
        sa.CheckConstraint("basic_salary >= 0", name="chk_payroll_basic_salary"),
        sa.CheckConstraint("allowances >= 0", name="chk_payroll_allowances"),
        sa.CheckConstraint("deductions >= 0", name="chk_payroll_deductions"),
        sa.UniqueConstraint("employee_id", "month", "year", name="uq_payroll_employee_month_year"),
    )
    op.create_index("idx_payrolls_employee_id", "payrolls", ["employee_id"], unique=False)
    op.create_index("idx_payrolls_month_year", "payrolls", ["month", "year"], unique=False)
    op.create_index("idx_payrolls_payment_status", "payrolls", ["payment_status"], unique=False)

    op.execute(
        """
        CREATE OR REPLACE FUNCTION trigger_set_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """
    )

    for table_name in ["users", "departments", "positions", "employees", "payrolls"]:
        op.execute(
            f"CREATE TRIGGER trg_{table_name}_updated_at BEFORE UPDATE ON {table_name} FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();"
        )

    op.execute(
        """
        CREATE OR REPLACE VIEW vw_dashboard_summary AS
        SELECT
            (SELECT COUNT(*) FROM employees WHERE status = 'ACTIVE') AS total_active_employees,
            (SELECT COUNT(*) FROM departments WHERE is_active = TRUE) AS total_departments,
            (SELECT COUNT(*) FROM positions WHERE is_active = TRUE) AS total_positions,
            (SELECT COALESCE(SUM(net_salary), 0) FROM payrolls
             WHERE month = EXTRACT(MONTH FROM CURRENT_DATE)::SMALLINT
             AND year = EXTRACT(YEAR FROM CURRENT_DATE)::SMALLINT) AS current_month_payroll_total,
            (SELECT COUNT(*) FROM payrolls WHERE payment_status = 'PENDING') AS pending_payrolls;
        """
    )


def downgrade() -> None:
    op.execute("DROP VIEW IF EXISTS vw_dashboard_summary")
    for table_name in ["payrolls", "employee_documents", "employees", "positions", "departments", "users"]:
        op.execute(f"DROP TRIGGER IF EXISTS trg_{table_name}_updated_at ON {table_name}")
    op.execute("DROP FUNCTION IF EXISTS trigger_set_updated_at")

    op.drop_index("idx_payrolls_payment_status", table_name="payrolls")
    op.drop_index("idx_payrolls_month_year", table_name="payrolls")
    op.drop_index("idx_payrolls_employee_id", table_name="payrolls")
    op.drop_table("payrolls")

    op.drop_index("idx_employee_documents_employee", table_name="employee_documents")
    op.drop_table("employee_documents")

    op.drop_index("idx_employees_status", table_name="employees")
    op.drop_index("idx_employees_position_id", table_name="employees")
    op.drop_index("idx_employees_department_id", table_name="employees")
    op.drop_table("employees")

    op.drop_index("idx_positions_department_id", table_name="positions")
    op.drop_table("positions")

    op.drop_index("idx_departments_is_active", table_name="departments")
    op.drop_table("departments")

    op.drop_index("idx_users_email", table_name="users")
    op.drop_table("users")

    document_type.drop(op.get_bind(), checkfirst=True)
    payment_status.drop(op.get_bind(), checkfirst=True)
    employee_status.drop(op.get_bind(), checkfirst=True)
    employment_type.drop(op.get_bind(), checkfirst=True)
    user_role.drop(op.get_bind(), checkfirst=True)