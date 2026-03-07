from sqlalchemy.orm import Session

from app.models.entities import Task, TaskRun
from app.orchestration.task_packet import TaskPacket
from app.workers.cli_worker import claude_worker, codex_worker


class ExecutionRunner:
    def __init__(self, db: Session):
        self.db = db

    def run_worker(self, task: Task, worker: str, packet: TaskPacket):
        client = codex_worker if worker == "codex" else claude_worker
        result = client.run(packet.to_prompt())
        task_run = TaskRun(
            task_id=task.id,
            worker=worker,
            prompt=packet.to_prompt(),
            stdout=result.stdout,
            stderr=result.stderr,
            status=result.status,
            changed_files=[],
        )
        self.db.add(task_run)
        self.db.commit()
        self.db.refresh(task_run)
        return task_run
