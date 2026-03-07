import { useQuery } from '@tanstack/react-query'
import { Activity, AlertTriangle, Cpu, HeartPulse, PackageSearch, ServerCog } from 'lucide-react'

import { fetchSystemHealth } from '../api/projects'

const presenceClass: Record<string, string> = {
  idle: 'bg-slate-500',
  thinking: 'bg-[var(--status-warning)] animate-pulse',
  executing: 'bg-[var(--status-success)] animate-pulse',
  waiting: 'bg-[var(--status-info)]',
  blocked: 'bg-[var(--status-error)]',
}

function healthChip(active: number, failed: number) {
  if (failed > 0) return { label: 'failing', cls: 'text-[var(--status-error)] bg-red-200/10' }
  if (active > 4) return { label: 'degraded', cls: 'text-[var(--status-warning)] bg-amber-200/10' }
  return { label: 'healthy', cls: 'text-[var(--status-success)] bg-emerald-200/10' }
}

export function AgentStatusPanel() {
  const { data } = useQuery({ queryKey: ['system-health'], queryFn: fetchSystemHealth, refetchInterval: 10000 })
  const active = data?.active_tasks ?? 0
  const failed = data?.failed_tasks ?? 0
  const chip = healthChip(active, failed)

  return (
    <aside className="panel flex h-full w-80 flex-col gap-4 p-4">
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100"><Cpu className="h-4 w-4 text-slate-400" />Agent Status</h2>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${chip.cls}`}>{chip.label}</span>
        </div>
        <div className="space-y-2">
          {data?.agents?.map((agent) => (
            <div key={agent.name} className="flex items-center justify-between rounded-xl bg-black/25 px-3 py-2 text-xs ring-1 ring-[var(--line-soft)]">
              <div className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-slate-500" />
                <span className="font-medium text-slate-200">{agent.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className={`h-2.5 w-2.5 rounded-full ${presenceClass[agent.state] ?? 'bg-slate-600'}`} />
                <span>{agent.state}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-black/25 p-3 ring-1 ring-[var(--line-soft)]">
        <h3 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"><ServerCog className="h-3.5 w-3.5" />Execution runs</h3>
        <div className="space-y-1 text-xs text-slate-400">
          <p>Codex worker calls available</p>
          <p>Claude worker calls available</p>
          <p className="text-slate-500">Use task runs for full output inspection</p>
        </div>
      </section>

      <section className="rounded-xl bg-black/25 p-3 ring-1 ring-[var(--line-soft)]">
        <h3 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"><AlertTriangle className="h-3.5 w-3.5" />System alerts</h3>
        <p className="text-xs text-slate-400">Watcher alerts and runtime issues stream to activity feed in real time.</p>
      </section>

      <section className="mt-auto rounded-xl bg-black/25 p-3 ring-1 ring-[var(--line-soft)]">
        <h3 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"><PackageSearch className="h-3.5 w-3.5" />Queue depth</h3>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-semibold text-slate-100">{active}</p>
          <p className={`text-xs ${active > 4 ? 'text-[var(--status-warning)]' : 'text-[var(--status-success)]'}`}>{active > 4 ? 'elevated backlog' : 'normal'}</p>
        </div>
      </section>

      <section className="rounded-xl bg-black/25 p-3 ring-1 ring-[var(--line-soft)]">
        <h3 className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"><HeartPulse className="h-3.5 w-3.5" />System health</h3>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-slate-500" />Failed tasks</span>
          <span className={failed > 0 ? 'text-[var(--status-error)]' : 'text-[var(--status-success)]'}>{failed}</span>
        </div>
      </section>
    </aside>
  )
}
