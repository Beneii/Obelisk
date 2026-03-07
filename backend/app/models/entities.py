from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.enums import AgentPresence, MessageType, ProjectStatus, TaskStatus


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus), default=ProjectStatus.active
    )

    tasks: Mapped[list["Task"]] = relationship(back_populates="project", cascade="all,delete")


class Task(Base, TimestampMixin):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[TaskStatus] = mapped_column(Enum(TaskStatus), default=TaskStatus.pending)
    priority: Mapped[int] = mapped_column(Integer, default=3)
    assigned_agent: Mapped[str | None] = mapped_column(String(64))
    branch: Mapped[str | None] = mapped_column(String(128))

    project: Mapped["Project"] = relationship(back_populates="tasks")
    messages: Mapped[list["TaskMessage"]] = relationship(back_populates="task", cascade="all,delete")


class TaskMessage(Base, TimestampMixin):
    __tablename__ = "task_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), nullable=False)
    sender: Mapped[str] = mapped_column(String(64), nullable=False)
    type: Mapped[MessageType] = mapped_column(Enum(MessageType), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    task: Mapped["Task"] = relationship(back_populates="messages")


class TaskRun(Base, TimestampMixin):
    __tablename__ = "task_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), nullable=False)
    worker: Mapped[str] = mapped_column(String(64), nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    stdout: Mapped[str | None] = mapped_column(Text)
    stderr: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    changed_files: Mapped[list[str]] = mapped_column(JSON, default=list)


class Artifact(Base, TimestampMixin):
    __tablename__ = "artifacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int | None] = mapped_column(ForeignKey("tasks.id"))
    kind: Mapped[str] = mapped_column(String(64), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)


class MemoryEntry(Base, TimestampMixin):
    __tablename__ = "memory_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id"))
    memory_type: Mapped[str] = mapped_column(String(64), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[list[float] | None] = mapped_column(JSON)


class AgentStatus(Base, TimestampMixin):
    __tablename__ = "agent_status"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    agent_name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    state: Mapped[AgentPresence] = mapped_column(Enum(AgentPresence), nullable=False)
    current_task_id: Mapped[int | None] = mapped_column(ForeignKey("tasks.id"))


class TaskDependency(Base, TimestampMixin):
    __tablename__ = "task_dependencies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), nullable=False)
    depends_on_task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"), nullable=False)
