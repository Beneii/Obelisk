import { AlertTriangle, CheckCircle2, Circle, Clock3 } from 'lucide-react'

import { Task, TaskStatus } from '../api/projects'
import { TaskCard } from './TaskCard'

const columnMeta: Record<TaskStatus, { color: string; icon: JSX.Element }> = {
  pending: { color: 'text-[var(--status-warning)]', icon: <Clock3 className="h-3.5 w-3.5" /> },
  active: { color: 'text-[var(--status-info)]', icon: <Circle className="h-3.5 w-3.5" /> },
  blocked: { color: 'text-[var(--status-error)]', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  completed: { color: 'text-[var(--status-success)]', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  failed: { color: 'text-[var(--status-error)]', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  waiting_approval: { color: 'text-[var(--status-warning)]', icon: <Clock3 className="h-3.5 w-3.5" /> },
}

export function TaskColumn({
  status,
  tasks,
  onDropTask,
  onSelectTask,
}: {
  status: TaskStatus
  tasks: Task[]
  onDropTask: (taskId: number, status: TaskStatus) => void
  onSelectTask: (taskId: number) => void
}) {
  const meta = columnMeta[status]

  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        const value = event.dataTransfer.getData('text/task-id')
        if (!value) return
        onDropTask(Number(value), status)
      }}
      className="rounded-2xl bg-white/[0.025] p-3.5 ring-1 ring-[var(--line-soft)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          <span className={meta.color}>{meta.icon}</span>
          {status.replace('_', ' ')}
        </h3>
        <span className="rounded-md bg-black/20 px-1.5 py-0.5 text-[11px] text-slate-500">{tasks.length}</span>
      </div>
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onSelect={() => onSelectTask(task.id)} />
        ))}
      </div>
    </section>
  )
}
