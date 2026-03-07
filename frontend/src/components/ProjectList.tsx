import { useQueries, useQuery } from '@tanstack/react-query'
import { FolderKanban } from 'lucide-react'

import { fetchProjects, fetchTasks } from '../api/projects'
import { useUIStore } from '../store/uiStore'

export function ProjectList() {
  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  const selectedProjectId = useUIStore((s) => s.selectedProjectId)
  const setProject = useUIStore((s) => s.setProject)

  const taskQueries = useQueries({
    queries: projects.map((project) => ({ queryKey: ['tasks', project.id], queryFn: () => fetchTasks(project.id) })),
  })

  const activeCountFor = (index: number) => taskQueries[index]?.data?.filter((task) => task.status === 'active').length ?? 0

  return (
    <div className="space-y-1.5">
      {isLoading && Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="h-11 animate-pulse rounded-xl bg-white/[0.03]" />)}
      {projects.map((project, index) => {
        const activeCount = activeCountFor(index)
        return (
          <button
            key={project.id}
            onClick={() => setProject(project.id)}
            className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
              selectedProjectId === project.id
                ? 'bg-[#1a2433] text-slate-100 ring-1 ring-[#6aa9ff66]'
                : 'text-slate-300 hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <FolderKanban className="h-4 w-4 text-slate-500 group-hover:text-slate-300" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{project.name}</p>
                <p className="truncate text-[11px] text-slate-500">{project.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className={`h-2 w-2 rounded-full ${activeCount > 0 ? 'bg-[var(--status-success)]' : 'bg-slate-600'}`} />
              <span>{activeCount}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
