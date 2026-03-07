from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.agents.base import AgentBase
from app.models.entities import Task
from app.models.enums import AgentPresence, TaskStatus


class WatcherAgent(AgentBase):
    name = "watcher"

    def __init__(self, db: Session):
        super().__init__(db)

    def check_stalled_tasks(self):
        self.set_state(AgentPresence.thinking)
        threshold = datetime.utcnow() - timedelta(minutes=60)
        stalled = (
            self.db.query(Task)
            .filter(Task.status.in_([TaskStatus.pending, TaskStatus.active]))
            .filter(Task.updated_at < threshold)
            .all()
        )
        self.set_state(AgentPresence.idle)
        return stalled
