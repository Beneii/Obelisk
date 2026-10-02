# Obelisk

Local-first AI orchestration workspace. You describe work in a command console; the app turns that into projects, tasks, and agent-coordinated execution with a realtime activity feed.

Built as a hiring-visible systems sample: FastAPI + PostgreSQL + Redis + React, runnable with Docker Compose.

## Stack

| Layer | Tech |
|-------|------|
| Backend | FastAPI, SQLAlchemy, Alembic, PostgreSQL (pgvector image), Redis |
| Frontend | React, Vite, TypeScript, Tailwind CSS, Zustand, TanStack Query |
| Realtime | WebSockets |
| Workers | CLI adapters for Codex and Claude Code (shell out with captured stdout/stderr) |
| Runtime | Docker Compose |

## What works today

- Multi-project APIs and a dashboard project list
- Brain-dump endpoint that derives goals/tasks from free text (heuristic CTO agent path)
- Task board statuses: `pending`, `active`, `blocked`, `completed`
- Agent roles modelled in code: CTO, Research, Builder, QA, Memory, Watcher
- Task thread messages for typed agent communication
- Task run persistence (prompt, worker, stdout/stderr, status)
- Memory store with searchable entries (embedding column present; full semantic search pipeline listed under hardening)
- Watcher loop every 60s for stalled tasks, broadcast over WebSockets
- `docker compose up --build` for local stack

This is a working baseline, not a production multi-tenant product. Auth, durable job queues, and a full embedding search pipeline are still open work.

## Repository layout

```
Obelisk/
  backend/          FastAPI app, Alembic migrations, agents, workers
  frontend/         Vite React UI (Mission Control)
  scripts/dev.sh    Convenience wrapper for compose
  docker-compose.yml
  docs/screenshots/ Place screenshots or GIFs here
```

## How to run

Requirements: Docker and Docker Compose.

```bash
git clone https://github.com/Beneii/Obelisk.git
cd Obelisk
docker compose up --build
```

Or: `./scripts/dev.sh`

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| OpenAPI docs | http://localhost:8000/docs |
| Postgres | localhost:5432 (user/db/password `obelisk` for local only) |
| Redis | localhost:6379 |

Compose sets local DB credentials for development. Do not reuse them outside this sandbox.

## Example workflow

1. In the command console: `create project Lumina`
2. Select the project in the sidebar
3. Run a brain dump, e.g. `brain dump I want Lumina to sync Canvas assignments and build an AI planner`
4. Watch tasks appear and activity events stream in the feed

## Screenshots

Add captures under `docs/screenshots/` and link them here.

```
docs/screenshots/mission-control.png   # task board + activity feed
docs/screenshots/command-console.png   # brain dump / create project
```

*(Placeholders until screenshots are added.)*

## Hardening backlog (not claimed as done)

- AuthN/AuthZ and audit trails
- pgvector embedding pipeline + semantic memory search end-to-end
- Durable background queues (Celery/RQ or similar)
- Richer diff viewer and merge approval in the UI
- Broader automated test matrix and CI

## Topics

Suggested GitHub topics: `fastapi`, `postgresql`, `pgvector`, `redis`, `docker`, `typescript`, `react`, `agents`, `websockets`

## License

Personal portfolio project. Ask before forking for commercial use.
