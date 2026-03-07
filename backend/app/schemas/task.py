from datetime import datetime

from pydantic import BaseModel


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    priority: int = 3


class TaskRead(BaseModel):
    id: int
    project_id: int
    title: str
    description: str | None
    status: str
    priority: int
    assigned_agent: str | None
    branch: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BrainDumpRequest(BaseModel):
    text: str
