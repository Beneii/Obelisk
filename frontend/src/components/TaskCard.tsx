import { AlertCircle, CheckCircle2, CircleDot, Clock3, PauseCircle } from 'lucide-react'

import { Task } from '../api/projects'

const statusMeta: Record<Task['status'], { label: string; dot: string; icon: JSX.Element }> = {
  pending: { label: 'pending', dot: 'bg-[var(--status-warning)]', icon: <Clock3 className="h-3.5 w-3.5" /> },
  active: { label: 'active', dot: 'bg-[var(--status-info)]', icon: <CircleDot className="h-3.5 w-3.5" /> },
  blocked: { label: 'blocked', dot: 'bg-[var(--status-error)]', icon: <PauseCircle className="h-3.5 w-3.5" /> },
  completed: { label: 'completed', dot: 'bg-[var(--status-success)]', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  failed: { label: 'failed', dot: 'bg-[var(--status-error)]', icon: <AlertCircle className="h-3.5 w-3.5" /> },
  waiting_approval: { label: 'waiting', dot: 'bg-[var(--status-warning)]', icon: <Clock3 className="h-3.5 w-3.5" /> },
}

export function TaskCard({ task, onSelect }: { task: Task; onSelect: () => void }) {
  const meta = statusMeta[task.status]

  return (
    <article
      draggable
      onDragStart={(event) => event.dataTransfer.setData('text/task-id', String(task.id))}
      onClick={onSelect}
      className="group cursor-grab rounded-2xl bg-[var(--bg-elev-2)] p-3.5 ring-1 ring-[var(--line-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(6,12,22,0.36)]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="line-clamp-2 text-sm font-semibold text-slate-100">{task.title}</h4>
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${meta.dot}`} />
      </div>

      <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">{task.description || 'No description provided.'}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="rounded-md bg-black/25 px-2 py-1 text-[11px] text-slate-400">{task.assigned_agent || 'unassigned'}</span>
        <span className="inline-flex items-center gap-1 rounded-md bg-black/25 px-2 py-1 text-[11px] text-slate-400">
          {meta.icon}
          {meta.label}
        </span>
      </div>
    </article>
  )
}
