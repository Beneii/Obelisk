import { useQuery } from '@tanstack/react-query'
import { Activity, FolderKanban, ListChecks, ShieldCheck } from 'lucide-react'

import { fetchProjects, fetchSystemHealth } from '../api/projects'
import { useUIStore } from '../store/uiStore'

export function MissionOverview() {
  const { data: health } = useQuery({ queryKey: ['system-health'], queryFn: fetchSystemHealth, refetchInterval: 12000 })
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  const feed = useUIStore((s) => s.feed)

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="panel p-4 xl:col-span-2">
        <h2 className="mb-1 text-lg font-semibold text-slate-100">Mission View</h2>
        <p className="mb-4 text-xs text-slate-500">Live autonomous engineering operations across all projects.</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-black/25 p-3 ring-1 ring-[var(--line-soft)]">
            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-slate-500"><FolderKanban className="h-3.5 w-3.5" />Projects</p>
            <p className="mt-1 text-2xl font-semibold text-slate-100">{projects.length}</p>
          </div>
          <div className="rounded-xl bg-black/25 p-3 ring-1 ring-[var(--line-soft)]">
            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-slate-500"><ListChecks className="h-3.5 w-3.5" />Active tasks</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--status-info)]">{health?.active_tasks ?? 0}</p>
          </div>
          <div className="rounded-xl bg-black/25 p-3 ring-1 ring-[var(--line-soft)]">
            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-slate-500"><ShieldCheck className="h-3.5 w-3.5" />Failed tasks</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--status-error)]">{health?.failed_tasks ?? 0}</p>
          </div>
          <div className="rounded-xl bg-black/25 p-3 ring-1 ring-[var(--line-soft)]">
            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-slate-500"><Activity className="h-3.5 w-3.5" />Recent events</p>
            <p className="mt-1 text-2xl font-semibold text-slate-100">{feed.length}</p>
          </div>
        </div>
      </div>

      <div className="panel p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-100">Active agents</h3>
        <div className="space-y-2">
          {health?.agents?.map((agent) => (
            <div key={agent.name} className="flex items-center justify-between rounded-lg bg-black/25 px-3 py-2 text-xs ring-1 ring-[var(--line-soft)]">
              <span className="text-slate-300">{agent.name}</span>
              <span className="text-slate-500">{agent.state}</span>
            </div>
          ))}
          {!health?.agents?.length && <p className="text-xs text-slate-500">Awaiting agent heartbeat.</p>}
        </div>
      </div>
    </section>
  )
}
