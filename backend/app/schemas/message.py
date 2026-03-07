from datetime import datetime

from pydantic import BaseModel


class MessageCreate(BaseModel):
    sender: str
    type: str
    content: str


class MessageRead(BaseModel):
    id: int
    task_id: int
    sender: str
    type: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
