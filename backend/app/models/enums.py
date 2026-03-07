from enum import StrEnum


class ProjectStatus(StrEnum):
    active = "active"
    paused = "paused"
    archived = "archived"


class TaskStatus(StrEnum):
    pending = "pending"
    active = "active"
    blocked = "blocked"
    waiting_approval = "waiting_approval"
    completed = "completed"
    failed = "failed"


class MessageType(StrEnum):
    request = "request"
    report = "report"
    assignment = "assignment"
    result = "result"
    issue = "issue"
    decision = "decision"


class AgentPresence(StrEnum):
    idle = "idle"
    thinking = "thinking"
    executing = "executing"
    waiting = "waiting"
    blocked = "blocked"
