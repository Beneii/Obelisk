from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import AgentStatus, Task
from app.models.enums import TaskStatus

router = APIRouter(prefix="/system", tags=["system"])


@router.get("/health")
def health(db: Session = Depends(get_db)):
    active = db.query(Task).filter(Task.status == TaskStatus.active).count()
    failed = db.query(Task).filter(Task.status == TaskStatus.failed).count()
    agents = db.query(AgentStatus).all()
    return {
        "timestamp": datetime.utcnow(),
        "active_tasks": active,
        "failed_tasks": failed,
        "agents": [{"name": a.agent_name, "state": a.state} for a in agents],
    }
