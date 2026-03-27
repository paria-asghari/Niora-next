import { create } from 'zustand'

export interface Message {
  id: number
  session_id: number
  user_id: number
  content: string
  is_from_user: boolean
  timestamp: Date
}

export interface Session {
  id: number
  user_id: number
  started_at: Date
  title?: string
  messages?: Message[]
}

export interface Issue {
  id: number
  user_id: number
  title: string
  description?: string
  status: 'open' | 'improving' | 'resolved'
  first_mentioned: Date
  last_updated: Date
  resolved_at?: Date
}

interface ChatStore {
  // Current session
  currentSession: Session | null
  messages: Message[]

  // Sessions list
  sessions: Session[]

  // Issues
  issues: Issue[]

  // UI state
  isLoading: boolean
  isStreaming: boolean
  error: string | null

  // Actions
  setCurrentSession: (session: Session | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  setSessions: (sessions: Session[]) => void
  setIssues: (issues: Issue[]) => void
  setIsLoading: (loading: boolean) => void
  setIsStreaming: (streaming: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  currentSession: null,
  messages: [],
  sessions: [],
  issues: [],
  isLoading: false,
  isStreaming: false,
  error: null,

  // Actions
  setCurrentSession: (session) => set({ currentSession: session }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setSessions: (sessions) => set({ sessions }),
  setIssues: (issues) => set({ issues }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))
