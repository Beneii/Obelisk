from sqlalchemy.orm import Session

from app.agents.base import AgentBase
from app.models.entities import Project, Task
from app.models.enums import AgentPresence
from app.services.brain_dump_service import BrainDumpService
from app.services.memory_service import MemoryService
from app.services.task_service import TaskService


class CTOAgent(AgentBase):
    name = "cto"

    def __init__(self, db: Session):
        super().__init__(db)
        self.brain = BrainDumpService()
        self.memory = MemoryService(db)
        self.tasks = TaskService(db)

    def analyze_brain_dump(self, project: Project, text: str) -> list[Task]:
        self.set_state(AgentPresence.thinking)
        analysis = self.brain.analyze(text)
        self.memory.store(project.id, "project_memory", f"Goals: {analysis.goals}")

        created: list[Task] = []
        for title, description, priority in analysis.tasks:
            created.append(self.tasks.create_task(project, title, description, priority))
        self.set_state(AgentPresence.idle)
        return created

    def assign_agents(self, task: Task):
        if "research" in task.title.lower() or "doc" in (task.description or "").lower():
            task.assigned_agent = "research"
        elif "test" in task.title.lower() or "validate" in (task.description or "").lower():
            task.assigned_agent = "qa"
        else:
            task.assigned_agent = "builder"
        self.db.commit()
        return task
