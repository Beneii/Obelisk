from sqlalchemy.orm import Session

from app.models.entities import MemoryEntry


class MemoryService:
    def __init__(self, db: Session):
        self.db = db

    def store(self, project_id: int | None, memory_type: str, content: str):
        entry = MemoryEntry(project_id=project_id, memory_type=memory_type, content=content)
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def search(self, project_id: int, query: str):
        return (
            self.db.query(MemoryEntry)
            .filter(MemoryEntry.project_id == project_id)
            .filter(MemoryEntry.content.ilike(f"%{query}%"))
            .order_by(MemoryEntry.created_at.desc())
            .limit(20)
            .all()
        )
