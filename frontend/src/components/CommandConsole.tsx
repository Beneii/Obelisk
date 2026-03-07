import { FormEvent, KeyboardEvent, useMemo, useState } from 'react'
import { ChevronRight, Terminal } from 'lucide-react'

import { useUIStore } from '../store/uiStore'

const examples = ['continue task 41', 'investigate failing tests', 'research Canvas API']

export function CommandConsole() {
  const [command, setCommand] = useState('')
  const pushFeed = useUIStore((s) => s.pushFeed)
  const pushCommandHistory = useUIStore((s) => s.pushCommandHistory)
  const navigateHistory = useUIStore((s) => s.navigateHistory)

  const suggestions = useMemo(
    () => examples.filter((item) => item.toLowerCase().includes(command.toLowerCase()) && command.length > 0),
    [command],
  )

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!command.trim()) return
    pushCommandHistory(command)
    pushFeed({ event: 'command_executed', detail: command })
    setCommand('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setCommand(navigateHistory('up'))
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setCommand(navigateHistory('down'))
    }
  }

  return (
    <section className="panel relative px-4 py-3">
      <form onSubmit={onSubmit} className="flex items-center gap-2 font-mono text-sm">
        <Terminal className="h-4 w-4 text-slate-500" />
        <span className="text-[var(--status-info)]">obelisk$</span>
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="issue command to agents"
          className="w-full bg-transparent text-slate-200 outline-none placeholder:text-slate-600"
        />
        <button className="inline-flex items-center gap-1 rounded-md bg-[#1a2433] px-2.5 py-1 text-xs font-semibold text-slate-100 ring-1 ring-[var(--line-soft)]">
          <ChevronRight className="h-3.5 w-3.5" />Run
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="absolute bottom-14 left-4 right-4 space-y-1 rounded-xl bg-[var(--bg-elev-2)] p-2 ring-1 ring-[var(--line-soft)]">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCommand(item)}
              className="block w-full rounded-md px-2 py-1 text-left font-mono text-xs text-slate-300 transition hover:bg-white/[0.06]"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
