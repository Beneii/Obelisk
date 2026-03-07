import { FileCode2, FileSearch, Package, ScrollText } from 'lucide-react'

const items = [
  { label: 'Task run logs', icon: <ScrollText className="h-3.5 w-3.5" /> },
  { label: 'Prompt versions', icon: <FileCode2 className="h-3.5 w-3.5" /> },
  { label: 'Diff snapshots', icon: <FileSearch className="h-3.5 w-3.5" /> },
  { label: 'QA reports', icon: <Package className="h-3.5 w-3.5" /> },
]

export function ArtifactsView() {
  return (
    <section className="panel p-4">
      <h3 className="mb-2 text-sm font-semibold text-slate-100">Artifacts</h3>
      <p className="text-xs text-slate-500">Diffs, logs, and execution outputs are indexed on the backend. Connect this panel to artifact retrieval endpoints as they expand.</p>
      <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="inline-flex items-center gap-2 rounded-xl bg-black/25 px-3 py-2 text-xs text-slate-300 ring-1 ring-[var(--line-soft)]">
            <span className="text-slate-500">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </section>
  )
}
