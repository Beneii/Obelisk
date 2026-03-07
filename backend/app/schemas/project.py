from datetime import datetime

from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None


class ProjectRead(BaseModel):
    id: int
    name: str
    description: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
