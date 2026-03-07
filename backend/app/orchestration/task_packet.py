from pydantic import BaseModel


class TaskPacket(BaseModel):
    task: str
    goal: str
    constraints: list[str]
    relevant_files: list[str]
    acceptance_criteria: list[str]

    def to_prompt(self) -> str:
        return (
            f"Task: {self.task}\n"
            f"Goal: {self.goal}\n"
            f"Constraints: {'; '.join(self.constraints) or 'none'}\n"
            f"Relevant Files: {', '.join(self.relevant_files) or 'none'}\n"
            f"Acceptance Criteria: {'; '.join(self.acceptance_criteria)}"
        )
