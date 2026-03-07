import { api } from './client'

export type Project = {
  id: number
  name: string
  description: string | null
  status: string
}

export type TaskStatus = 'pending' | 'active' | 'blocked' | 'completed' | 'failed' | 'waiting_approval'

export type Task = {
  id: number
  project_id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: number
  assigned_agent: string | null
}

export type TaskMessage = {
  id: number
  task_id: number
  sender: string
  type: 'request' | 'report' | 'assignment' | 'result' | 'issue' | 'decision'
  content: string
  created_at: string
}

export type AgentHealth = {
  name: string
  state: 'idle' | 'thinking' | 'executing' | 'waiting' | 'blocked'
}

export async function fetchProjects() {
  const { data } = await api.get<Project[]>('/projects')
  return data
}

export async function createProject(name: string, description: string) {
  const { data } = await api.post<Project>('/projects', { name, description })
  return data
}

export async function fetchTasks(projectId: number) {
  const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`)
  return data
}

export async function runBrainDump(projectId: number, text: string) {
  const { data } = await api.post<Task[]>(`/projects/${projectId}/tasks/brain-dump`, { text })
  return data
}

export async function fetchTaskMessages(projectId: number, taskId: number) {
  const { data } = await api.get<TaskMessage[]>(`/projects/${projectId}/tasks/${taskId}/messages`)
  return data
}

export async function sendTaskMessage(
  projectId: number,
  taskId: number,
  payload: { sender: string; type: TaskMessage['type']; content: string },
) {
  const { data } = await api.post<TaskMessage>(`/projects/${projectId}/tasks/${taskId}/messages`, payload)
  return data
}

export async function fetchSystemHealth() {
  const { data } = await api.get<{ agents: AgentHealth[]; active_tasks: number; failed_tasks: number }>('/system/health')
  return data
}
