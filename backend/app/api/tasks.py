from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.agents.cto_agent import CTOAgent
from app.database import get_db
from app.models.entities import Project, Task, TaskMessage
from app.models.enums import MessageType
from app.schemas.message import MessageCreate, MessageRead
from app.schemas.task import BrainDumpRequest, TaskCreate, TaskRead
from app.services.realtime import realtime_manager
from app.services.task_service import TaskService

router = APIRouter(prefix="/projects/{project_id}/tasks", tags=["tasks"])


@router.post("", response_model=TaskRead)
async def create_task(project_id: int, payload: TaskCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    task = TaskService(db).create_task(project, payload.title, payload.description or "", payload.priority)
    CTOAgent(db).assign_agents(task)
    await realtime_manager.broadcast("activity", "task_created", {"task_id": task.id, "title": task.title})
    return task


@router.get("", response_model=list[TaskRead])
def list_tasks(project_id: int, db: Session = Depends(get_db)):
    return db.query(Task).filter(Task.project_id == project_id).order_by(Task.created_at).all()


@router.post("/brain-dump", response_model=list[TaskRead])
async def brain_dump(project_id: int, payload: BrainDumpRequest, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    tasks = CTOAgent(db).analyze_brain_dump(project, payload.text)
    for task in tasks:
        CTOAgent(db).assign_agents(task)
    await realtime_manager.broadcast(
        "activity",
        "brain_dump_processed",
        {"project_id": project_id, "tasks_created": len(tasks)},
    )
    return tasks


@router.post("/{task_id}/messages", response_model=MessageRead)
async def create_message(
    project_id: int, task_id: int, payload: MessageCreate, db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.project_id == project_id, Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    msg = TaskMessage(
        task_id=task_id,
        sender=payload.sender,
        type=MessageType(payload.type),
        content=payload.content,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    await realtime_manager.broadcast("task_thread", "message", {"task_id": task_id, "content": payload.content})
    return msg


@router.get("/{task_id}/messages", response_model=list[MessageRead])
def list_messages(project_id: int, task_id: int, db: Session = Depends(get_db)):
    return (
        db.query(TaskMessage)
        .join(Task, Task.id == TaskMessage.task_id)
        .filter(Task.project_id == project_id, TaskMessage.task_id == task_id)
        .order_by(TaskMessage.created_at)
        .all()
    )
