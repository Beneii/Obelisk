from sqlalchemy.orm import Session

from app.models.entities import Project, Task
from app.models.enums import TaskStatus


class TaskService:
    def __init__(self, db: Session):
        self.db = db

    def create_task(self, project: Project, title: str, description: str, priority: int = 3):
        task = Task(
            project_id=project.id,
            title=title,
            description=description,
            priority=priority,
            status=TaskStatus.pending,
        )
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def list_by_project(self, project_id: int):
        return self.db.query(Task).filter(Task.project_id == project_id).all()
