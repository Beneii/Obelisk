# OBELISK MISSION CONTROL

Obelisk Mission Control is a local-first AI orchestration workspace that behaves like a compact engineering company: CEO commands in, autonomous agents coordinate project execution out.

## Tech Stack
- Backend: FastAPI, SQLAlchemy, PostgreSQL, Redis, pgvector, Alembic
- Frontend: React + Vite + TypeScript + TailwindCSS, Zustand, TanStack Query
- Realtime: WebSockets
- Environment: Docker Compose

## Features Implemented
- Multi-project management APIs and dashboard project list
- Brain dump ingestion endpoint that generates structured tasks
- Task board with status columns (`pending`, `active`, `blocked`, `completed`)
- Agent model set (CTO, Research, Builder, QA, Memory, Watcher)
- Task thread message model/API for typed agent communications
- Worker adapters for Codex CLI and Claude Code CLI command execution
- Task run persistence including prompt versioning and stdout/stderr capture
- Memory store and searchable memory entries
- Watcher loop running every minute for stalled task detection
- Realtime activity broadcasting over WebSockets
- Dockerized local development (`docker compose up`)

## Repository Layout
```
obelisk/
  backend/
  frontend/
  docker/
  scripts/
  docker-compose.yml
  README.md
```

## Run Locally
```bash
docker compose up --build
```

Endpoints:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Backend docs: http://localhost:8000/docs

## Example Workflow
1. In command console, run `create project Lumina`.
2. Select project in sidebar.
3. Run `brain dump I want Lumina to sync Canvas assignments and build an AI planner`.
4. Watch generated tasks appear and realtime events stream in the activity feed.

## Notes on Production Hardening
This baseline includes modular architecture and core orchestration loops. For hardened production rollout, add:
- AuthN/AuthZ and audit trails
- Pgvector embedding pipeline + semantic search
- Durable background queues (Celery/RQ)
- Rich diff viewer and task-branch merge approval workflow in UI
- Full integration/unit test matrix and CI pipelines
