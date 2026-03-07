import { GitBranch } from 'lucide-react'

import { Task } from '../api/projects'

export function TaskGraphView({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <div className="panel grid h-[420px] place-items-center text-sm text-slate-500">No tasks to graph yet.</div>
  }

  const nodes = tasks.slice(0, 8)

  return (
    <section className="panel p-4">
      <h3 className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-100"><GitBranch className="h-4 w-4 text-slate-400" />Task Graph</h3>
      <div className="relative h-[420px] overflow-hidden rounded-xl bg-black/30 ring-1 ring-[var(--line-soft)]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 420" fill="none">
          {nodes.slice(1).map((_, idx) => (
            <line
              key={idx}
              x1={100 + idx * 90}
              y1={80 + (idx % 2) * 120}
              x2={190 + idx * 90}
              y2={80 + ((idx + 1) % 2) * 120}
              stroke="rgba(106, 169, 255, 0.45)"
              strokeWidth="1.5"
            />
          ))}
        </svg>
        {nodes.map((task, idx) => (
          <div
            key={task.id}
            className="absolute w-44 rounded-lg bg-[#151a27] px-3 py-2 text-xs ring-1 ring-[var(--line-soft)]"
            style={{ left: `${40 + idx * 90}px`, top: `${52 + (idx % 2) * 120}px` }}
          >
            <p className="truncate font-medium text-slate-100">{task.title}</p>
            <p className="truncate text-[11px] text-slate-500">{task.assigned_agent ?? 'unassigned'}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
