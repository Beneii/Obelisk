from sqlalchemy.orm import Session

from app.models.entities import AgentStatus
from app.models.enums import AgentPresence


class AgentBase:
    name = "agent"

    def __init__(self, db: Session):
        self.db = db

    def set_state(self, state: AgentPresence):
        status = self.db.query(AgentStatus).filter(AgentStatus.agent_name == self.name).first()
        if not status:
            status = AgentStatus(agent_name=self.name, state=state)
            self.db.add(status)
        status.state = state
        self.db.commit()
