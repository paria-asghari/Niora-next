export interface Message {
  id: number
  session_id: number
  user_id: number
  content: string
  is_from_user: boolean
  timestamp: Date
}

export interface ChatSession {
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

export interface IssueUpdate {
  id: number
  issue_id: number
  session_id: number
  update_type: string
  content: string
  status_before?: string
  status_after?: string
  timestamp: Date
}
