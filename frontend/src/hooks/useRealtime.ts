import { useEffect } from 'react'

import { useUIStore } from '../store/uiStore'

export function useRealtime() {
  const pushFeed = useUIStore((s) => s.pushFeed)

  useEffect(() => {
    const ws = new WebSocket((import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000') + '/ws/activity')

    ws.onopen = () => {
      pushFeed({ event: 'ws_connected', detail: 'Activity stream connected' })
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      pushFeed({ event: message.event, detail: JSON.stringify(message.payload) })
    }

    ws.onclose = () => {
      pushFeed({ event: 'ws_disconnected', detail: 'Realtime connection closed' })
    }

    return () => ws.close()
  }, [pushFeed])
}
