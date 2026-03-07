import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { MissionControlPage } from './pages/MissionControlPage'
import { useRealtime } from './hooks/useRealtime'
import './styles/index.css'

const queryClient = new QueryClient()

function App() {
  useRealtime()
  return <MissionControlPage />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
