import { AlertTriangle, CheckCircle2, Cpu, PlugZap, TerminalSquare, Wifi } from 'lucide-react'

import { useUIStore } from '../store/uiStore'

const metaByEvent: Record<string, { label: string; icon: JSX.Element; tint: string }> = {
  task_created: { label: 'Task created', icon: <CheckCircle2 className="h-3.5 w-3.5" />, tint: 'text-[var(--status-info)]' },
  brain_dump_processed: { label: 'Brain dump processed', icon: <Cpu className="h-3.5 w-3.5" />, tint: 'text-[var(--status-warning)]' },
  stalled_tasks: { label: 'Stalled task alert', icon: <AlertTriangle className="h-3.5 w-3.5" />, tint: 'text-[var(--status-error)]' },
  ws_connected: { label: 'Realtime connected', icon: <Wifi className="h-3.5 w-3.5" />, tint: 'text-[var(--status-success)]' },
  ws_disconnected: { label: 'Realtime disconnected', icon: <PlugZap className="h-3.5 w-3.5" />, tint: 'text-[var(--status-error)]' },
  command_executed: { label: 'Command executed', icon: <TerminalSquare className="h-3.5 w-3.5" />, tint: 'text-[var(--status-info)]' },
}

export function ActivityFeed() {
  const feed = useUIStore((s) => s.feed)

  return (
    <section className="panel p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">Activity Feed</h3>
        <span className="text-[11px] text-slate-500">chronological</span>
      </div>
      <div className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
        {feed.length === 0 && <p className="text-xs text-slate-500">No events yet.</p>}
        {feed.map((event) => {
          const meta = metaByEvent[event.event] ?? {
            label: event.event.split('_').join(' '),
            icon: <TerminalSquare className="h-3.5 w-3.5" />,
            tint: 'text-slate-400',
          }

          return (
            <div key={event.id} className="flex items-center gap-2 rounded-xl bg-black/25 px-3 py-2 text-xs ring-1 ring-[var(--line-soft)]">
              <span className={meta.tint}>{meta.icon}</span>
              <span className="text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
              <span className="font-medium text-slate-300">{meta.label}</span>
              {event.detail && <span className="truncate text-slate-500">{event.detail}</span>}
            </div>
          )
        })}
      </div>
    </section>
  )
}
