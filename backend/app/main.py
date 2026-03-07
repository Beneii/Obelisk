import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.agents.watcher_agent import WatcherAgent
from app.api.projects import router as projects_router
from app.api.system import router as system_router
from app.api.tasks import router as tasks_router
from app.config import settings
from app.database import SessionLocal
from app.services.realtime import realtime_manager

app = FastAPI(title=settings.app_name)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(system_router, prefix="/api")


async def watcher_loop():
    while True:
        db: Session = SessionLocal()
        try:
            stalled = WatcherAgent(db).check_stalled_tasks()
            if stalled:
                await realtime_manager.broadcast(
                    "activity",
                    "stalled_tasks",
                    {"count": len(stalled), "task_ids": [task.id for task in stalled]},
                )
        finally:
            db.close()
        await asyncio.sleep(60)


@app.on_event("startup")
async def startup():
    asyncio.create_task(watcher_loop())


@app.websocket("/ws/{channel}")
async def websocket_channel(websocket: WebSocket, channel: str):
    await realtime_manager.connect(channel, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await realtime_manager.disconnect(channel, websocket)


@app.get("/")
def root():
    return {"service": "obelisk-mission-control", "status": "ok"}
