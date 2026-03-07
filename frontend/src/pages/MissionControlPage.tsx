import { useQuery } from '@tanstack/react-query'
import { BarChart3, Boxes, Compass, KanbanSquare } from 'lucide-react'

import { fetchTasks } from '../api/projects'
import { ActivityFeed } from '../components/ActivityFeed'
import { AgentStatusPanel } from '../components/AgentStatusPanel'
import { ArtifactsView } from '../components/ArtifactsView'
import { CommandConsole } from '../components/CommandConsole'
import { MissionOverview } from '../components/MissionOverview'
import { Sidebar } from '../components/Sidebar'
import { TaskBoard } from '../components/TaskBoard'
import { TaskGraphView } from '../components/TaskGraphView'
import { TaskThread } from '../components/TaskThread'
import { useUIStore, WorkspaceView } from '../store/uiStore'

const views: Array<{ key: WorkspaceView; label: string; icon: JSX.Element }> = [
  { key: 'mission', label: 'Mission View', icon: <Compass className="h-3.5 w-3.5" /> },
  { key: 'board', label: 'Project Board', icon: <KanbanSquare className="h-3.5 w-3.5" /> },
  { key: 'graph', label: 'Task Graph', icon: <BarChart3 className="h-3.5 w-3.5" /> },
  { key: 'artifacts', label: 'Artifacts', icon: <Boxes className="h-3.5 w-3.5" /> },
]

export function MissionControlPage() {
  const selectedProjectId = useUIStore((s) => s.selectedProjectId)
  const view = useUIStore((s) => s.view)
  const setView = useUIStore((s) => s.setView)

  const { data: currentTasks = [] } = useQuery({
    queryKey: ['tasks', selectedProjectId],
    queryFn: () => fetchTasks(selectedProjectId!),
    enabled: Boolean(selectedProjectId),
  })

  return (
    <main className="h-screen overflow-hidden bg-[var(--bg-canvas)] p-4 text-slate-100">
      <div className="grid h-full grid-cols-[320px_1fr_320px] gap-4">
        <Sidebar />

        <section className="grid min-h-0 grid-rows-[auto_1fr_auto] gap-4">
          <header className="panel p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Mission Control</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {views.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${view === item.key ? 'bg-[#1a2433] text-slate-100 ring-1 ring-[#6aa9ff66]' : 'text-slate-400 hover:bg-white/[0.05]'}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          <div className="grid min-h-0 grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
            <section className="min-h-0 space-y-4 overflow-y-auto pr-1">
              {view === 'mission' && <MissionOverview />}
              {view === 'board' && <TaskBoard />}
              {view === 'graph' && <TaskGraphView tasks={currentTasks} />}
              {view === 'artifacts' && <ArtifactsView />}
              <ActivityFeed />
            </section>
            <TaskThread />
          </div>

          <CommandConsole />
        </section>

        <AgentStatusPanel />
      </div>
    </main>
  )
}
