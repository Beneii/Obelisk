import { create } from 'zustand'

export type WorkspaceView = 'mission' | 'board' | 'graph' | 'artifacts'

type FeedEvent = {
  id: string
  timestamp: string
  event: string
  detail?: string
}

type UIState = {
  selectedProjectId: number | null
  selectedTaskId: number | null
  view: WorkspaceView
  commandHistory: string[]
  historyIndex: number
  feed: FeedEvent[]
  setView: (view: WorkspaceView) => void
  setProject: (id: number) => void
  setTask: (id: number | null) => void
  pushFeed: (event: Omit<FeedEvent, 'id' | 'timestamp'>) => void
  pushCommandHistory: (command: string) => void
  navigateHistory: (direction: 'up' | 'down') => string
}

export const useUIStore = create<UIState>((set, get) => ({
  selectedProjectId: null,
  selectedTaskId: null,
  view: 'mission',
  commandHistory: [],
  historyIndex: -1,
  feed: [],
  setView: (view) => set({ view }),
  setProject: (id) => set({ selectedProjectId: id, selectedTaskId: null, view: 'board' }),
  setTask: (id) => set({ selectedTaskId: id }),
  pushFeed: (event) =>
    set((state) => ({
      feed: [
        { id: crypto.randomUUID(), timestamp: new Date().toISOString(), event: event.event, detail: event.detail },
        ...state.feed,
      ].slice(0, 200),
    })),
  pushCommandHistory: (command) =>
    set((state) => ({
      commandHistory: [command, ...state.commandHistory.filter((item) => item !== command)].slice(0, 30),
      historyIndex: -1,
    })),
  navigateHistory: (direction) => {
    const { commandHistory, historyIndex } = get()
    if (commandHistory.length === 0) return ''

    if (direction === 'up') {
      const next = Math.min(historyIndex + 1, commandHistory.length - 1)
      set({ historyIndex: next })
      return commandHistory[next]
    }

    const next = Math.max(historyIndex - 1, -1)
    set({ historyIndex: next })
    return next === -1 ? '' : commandHistory[next]
  },
}))
