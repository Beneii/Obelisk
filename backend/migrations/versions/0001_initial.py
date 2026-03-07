"""initial

Revision ID: 0001_initial
Revises:
Create Date: 2026-01-01 00:00:00
"""

from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False, unique=True),
        sa.Column("description", sa.Text()),
        sa.Column("status", sa.Enum("active", "paused", "archived", name="projectstatus"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column(
            "status",
            sa.Enum(
                "pending",
                "active",
                "blocked",
                "waiting_approval",
                "completed",
                "failed",
                name="taskstatus",
            ),
            nullable=False,
        ),
        sa.Column("priority", sa.Integer(), nullable=False),
        sa.Column("assigned_agent", sa.String(length=64)),
        sa.Column("branch", sa.String(length=128)),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "task_messages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("task_id", sa.Integer(), sa.ForeignKey("tasks.id"), nullable=False),
        sa.Column("sender", sa.String(length=64), nullable=False),
        sa.Column(
            "type",
            sa.Enum("request", "report", "assignment", "result", "issue", "decision", name="messagetype"),
            nullable=False,
        ),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "task_runs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("task_id", sa.Integer(), sa.ForeignKey("tasks.id"), nullable=False),
        sa.Column("worker", sa.String(length=64), nullable=False),
        sa.Column("prompt", sa.Text(), nullable=False),
        sa.Column("stdout", sa.Text()),
        sa.Column("stderr", sa.Text()),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("changed_files", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "artifacts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("task_id", sa.Integer(), sa.ForeignKey("tasks.id")),
        sa.Column("kind", sa.String(length=64), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "memory_entries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id")),
        sa.Column("memory_type", sa.String(length=64), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("embedding", sa.JSON()),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "agent_status",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("agent_name", sa.String(length=64), nullable=False, unique=True),
        sa.Column("state", sa.Enum("idle", "thinking", "executing", "waiting", "blocked", name="agentpresence"), nullable=False),
        sa.Column("current_task_id", sa.Integer(), sa.ForeignKey("tasks.id")),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )
    op.create_table(
        "task_dependencies",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("task_id", sa.Integer(), sa.ForeignKey("tasks.id"), nullable=False),
        sa.Column("depends_on_task_id", sa.Integer(), sa.ForeignKey("tasks.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("task_dependencies")
    op.drop_table("agent_status")
    op.drop_table("memory_entries")
    op.drop_table("artifacts")
    op.drop_table("task_runs")
    op.drop_table("task_messages")
    op.drop_table("tasks")
    op.drop_table("projects")
