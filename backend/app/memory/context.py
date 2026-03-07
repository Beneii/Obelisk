from sqlalchemy.orm import Session

from app.models.entities import Artifact, MemoryEntry


class ContextBuilder:
    def __init__(self, db: Session):
        self.db = db

    def build_bundle(self, project_id: int):
        memories = (
            self.db.query(MemoryEntry)
            .filter(MemoryEntry.project_id == project_id)
            .order_by(MemoryEntry.updated_at.desc())
            .limit(10)
            .all()
        )
        artifacts = (
            self.db.query(Artifact)
            .order_by(Artifact.updated_at.desc())
            .limit(10)
            .all()
        )
        return {
            "memory": [m.content for m in memories],
            "artifacts": [a.content for a in artifacts],
        }
