import asyncio
import json
from collections import defaultdict
from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self._channels: dict[str, set[WebSocket]] = defaultdict(set)
        self._lock = asyncio.Lock()

    async def connect(self, channel: str, websocket: WebSocket):
        await websocket.accept()
        async with self._lock:
            self._channels[channel].add(websocket)

    async def disconnect(self, channel: str, websocket: WebSocket):
        async with self._lock:
            self._channels[channel].discard(websocket)

    async def broadcast(self, channel: str, event: str, payload: Any):
        data = json.dumps({"event": event, "payload": payload}, default=str)
        stale = []
        for socket in self._channels[channel]:
            try:
                await socket.send_text(data)
            except Exception:
                stale.append(socket)
        for socket in stale:
            await self.disconnect(channel, socket)


realtime_manager = ConnectionManager()
