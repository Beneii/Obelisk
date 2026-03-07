import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { fetchTasks, TaskStatus } from '../api/projects'
import { useUIStore } from '../store/uiStore'
import { TaskColumn } from './TaskColumn'

const lanes: TaskStatus[] = ['pending', 'active', 'blocked', 'completed']

export function TaskBoard() {
  const selectedProjectId = useUIStore((s) => s.selectedProjectId)
  const setTask = useUIStore((s) => s.setTask)
  const [localState, setLocalState] = useState<Record<number, TaskStatus>>({})

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', selectedProjectId],
    queryFn: () => fetchTasks(selectedProjectId!),
    enabled: Boolean(selectedProjectId),
  })

  const hydrated = useMemo(
    () => tasks.map((task) => ({ ...task, status: localState[task.id] ?? task.status })),
    [tasks, localState],
  )

  if (!selectedProjectId) {
    return <div className="grid h-[480px] place-items-center rounded-2xl bg-white/[0.03] text-sm text-slate-500">Select a project to open the board.</div>
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-[430px] animate-pulse rounded-2xl bg-white/[0.03]" />
        ))}
      </div>
    )
  }

  return (
    <section className="grid grid-cols-1 gap-3 xl:grid-cols-4">
      {lanes.map((status) => (
        <TaskColumn
          key={status}
          status={status}
          tasks={hydrated.filter((task) => task.status === status)}
          onSelectTask={setTask}
          onDropTask={(taskId, next) => setLocalState((state) => ({ ...state, [taskId]: next }))}
        />
      ))}
    </section>
  )
}
