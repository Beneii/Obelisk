from dataclasses import dataclass


@dataclass
class BrainDumpResult:
    goals: list[str]
    tasks: list[tuple[str, str, int]]


class BrainDumpService:
    def analyze(self, text: str) -> BrainDumpResult:
        chunks = [c.strip() for c in text.replace("\n", ".").split(".") if c.strip()]
        goals = chunks[:3] if chunks else [text[:140]]
        tasks = []
        for idx, goal in enumerate(goals, start=1):
            tasks.append((f"Goal {idx}: {goal[:60]}", f"Derived from brain dump: {goal}", max(1, 4 - idx)))
        tasks.append(("Create validation checklist", "Add QA, test, and review gates", 2))
        return BrainDumpResult(goals=goals, tasks=tasks)
