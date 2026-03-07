import { AlertTriangle, CheckCircle2, ClipboardList, CornerDownRight, FileSearch, Gavel } from 'lucide-react'

import { TaskMessage } from '../api/projects'

const tone: Record<TaskMessage['type'], { text: string; icon: JSX.Element }> = {
  request: { text: 'text-[var(--status-info)]', icon: <CornerDownRight className="h-3.5 w-3.5" /> },
  report: { text: 'text-slate-300', icon: <ClipboardList className="h-3.5 w-3.5" /> },
  assignment: { text: 'text-[var(--status-warning)]', icon: <FileSearch className="h-3.5 w-3.5" /> },
  result: { text: 'text-[var(--status-success)]', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  issue: { text: 'text-[var(--status-error)]', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  decision: { text: 'text-[var(--status-info)]', icon: <Gavel className="h-3.5 w-3.5" /> },
}

export function AgentMessage({ message }: { message: TaskMessage }) {
  const meta = tone[message.type]

  return (
    <article className="rounded-xl bg-black/25 px-3 py-2.5 ring-1 ring-[var(--line-soft)]">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1c2533] text-[9px] font-semibold text-slate-300 ring-1 ring-[var(--line-soft)]">
            {message.sender.slice(0, 2).toUpperCase()}
          </span>
          <span className="text-xs font-medium text-slate-200">{message.sender}</span>
          <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] ${meta.text}`}>
            {meta.icon}
            {message.type}
          </span>
        </div>
        <span className="text-[10px] text-slate-500">{new Date(message.created_at).toLocaleTimeString()}</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-300">{message.content}</p>
    </article>
  )
}
