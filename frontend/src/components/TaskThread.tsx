import { FormEvent, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MessagesSquare, Send } from 'lucide-react'

import { fetchTaskMessages, sendTaskMessage } from '../api/projects'
import { useUIStore } from '../store/uiStore'
import { AgentMessage } from './AgentMessage'

export function TaskThread() {
  const selectedProjectId = useUIStore((s) => s.selectedProjectId)
  const selectedTaskId = useUIStore((s) => s.selectedTaskId)
  const [draft, setDraft] = useState('')
  const queryClient = useQueryClient()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['task-messages', selectedProjectId, selectedTaskId],
    queryFn: () => fetchTaskMessages(selectedProjectId!, selectedTaskId!),
    enabled: Boolean(selectedProjectId && selectedTaskId),
  })

  const send = useMutation({
    mutationFn: async (content: string) =>
      sendTaskMessage(selectedProjectId!, selectedTaskId!, { sender: 'CEO', type: 'request', content }),
    onSuccess: async () => {
      setDraft('')
      await queryClient.invalidateQueries({ queryKey: ['task-messages', selectedProjectId, selectedTaskId] })
    },
  })

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.trim()) return
    send.mutate(draft)
  }

  return (
    <section className="panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-100"><MessagesSquare className="h-4 w-4 text-slate-400" />Task Thread</h3>
        {selectedTaskId && <span className="text-xs text-slate-500">Task #{selectedTaskId}</span>}
      </div>

      {!selectedTaskId && <p className="text-xs text-slate-500">Select a task card to inspect cross-agent communication.</p>}
      {selectedTaskId && (
        <>
          <div className="mb-3 max-h-64 space-y-2 overflow-y-auto pr-1">
            {isLoading && Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="h-14 animate-pulse rounded-lg bg-white/[0.03]" />)}
            {messages.map((message) => (
              <AgentMessage key={message.id} message={message} />
            ))}
            {!isLoading && messages.length === 0 && <p className="text-xs text-slate-500">No messages yet.</p>}
          </div>
          <form onSubmit={onSubmit} className="space-y-2">
            <textarea
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Issue an instruction to agents..."
              className="w-full resize-none rounded-xl bg-black/25 px-3 py-2 text-xs text-slate-200 outline-none ring-1 ring-[var(--line-soft)] focus:ring-[var(--status-info)]/70"
            />
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a2433] px-3 py-1.5 text-xs font-semibold text-slate-100 ring-1 ring-[var(--line-soft)] transition hover:bg-[#1e2a3b]"><Send className="h-3.5 w-3.5" />Send</button>
          </form>
        </>
      )}
    </section>
  )
}
