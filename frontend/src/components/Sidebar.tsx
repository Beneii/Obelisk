import { FormEvent, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Activity, FolderPlus, HeartPulse, Sparkles, Workflow } from 'lucide-react'

import { createProject } from '../api/projects'
import { useUIStore } from '../store/uiStore'
import { ProjectList } from './ProjectList'

export function Sidebar() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const queryClient = useQueryClient()
  const setView = useUIStore((s) => s.setView)

  const create = useMutation({
    mutationFn: async () => createProject(name, description || 'Mission generated project'),
    onSuccess: async () => {
      setOpenCreate(false)
      setName('')
      setDescription('')
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  const onCreate = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    create.mutate()
  }

  return (
    <aside className="panel flex h-full w-80 flex-col p-4">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-slate-100">Obelisk</h1>
          <p className="text-xs text-slate-500">Mission navigation</p>
        </div>
        <button
          onClick={() => setOpenCreate((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a2433] px-2.5 py-1.5 text-xs font-semibold text-slate-100 ring-1 ring-[var(--line-soft)] transition hover:bg-[#1e2a3b]"
        >
          <FolderPlus className="h-3.5 w-3.5" />
          Create
        </button>
      </div>

      {openCreate && (
        <form onSubmit={onCreate} className="mb-4 space-y-2 rounded-xl bg-black/25 p-3 ring-1 ring-[var(--line-soft)]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Project name"
            className="w-full rounded-lg bg-black/30 px-2.5 py-2 text-xs text-slate-100 outline-none ring-1 ring-white/10 focus:ring-[var(--status-info)]/70"
          />
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            className="w-full rounded-lg bg-black/30 px-2.5 py-2 text-xs text-slate-100 outline-none ring-1 ring-white/10 focus:ring-[var(--status-info)]/70"
          />
          <button className="w-full rounded-lg bg-[#1a2433] px-2.5 py-2 text-xs font-semibold text-slate-100 ring-1 ring-[var(--line-soft)]">Create project</button>
        </form>
      )}

      <section className="mb-4">
        <h2 className="mb-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">Projects</h2>
        <ProjectList />
      </section>

      <section className="mb-4 space-y-2">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Quick actions</h2>
        <button onClick={() => setView('mission')} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/[0.07]"><Sparkles className="h-3.5 w-3.5 text-slate-400" />Mission overview</button>
        <button onClick={() => setView('graph')} className="flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/[0.07]"><Workflow className="h-3.5 w-3.5 text-slate-400" />Task dependency graph</button>
      </section>

      <section className="mt-auto space-y-2 rounded-xl bg-white/[0.03] p-3 text-xs ring-1 ring-[var(--line-soft)]">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-slate-500">System health</h2>
        <div className="flex items-center justify-between text-slate-300"><span className="inline-flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-slate-500" />Realtime</span><span className="text-[var(--status-success)]">online</span></div>
        <div className="flex items-center justify-between text-slate-300"><span className="inline-flex items-center gap-1.5"><HeartPulse className="h-3.5 w-3.5 text-slate-500" />Queue depth</span><span className="text-[var(--status-warning)]">normal</span></div>
      </section>
    </aside>
  )
}
