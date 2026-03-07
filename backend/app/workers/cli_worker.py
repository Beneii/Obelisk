import shlex
import subprocess
from dataclasses import dataclass


@dataclass
class WorkerResult:
    status: str
    stdout: str
    stderr: str


class CLIWorker:
    def __init__(self, command_template: str):
        self.command_template = command_template

    def run(self, prompt: str) -> WorkerResult:
        command = self.command_template.format(prompt=shlex.quote(prompt))
        proc = subprocess.run(command, shell=True, text=True, capture_output=True)
        status = "success" if proc.returncode == 0 else "failed"
        return WorkerResult(status=status, stdout=proc.stdout, stderr=proc.stderr)


codex_worker = CLIWorker('codex {prompt}')
claude_worker = CLIWorker('claude code {prompt}')
