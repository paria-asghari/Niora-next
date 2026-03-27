export interface ApiResponse<T = any> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

export interface ChatRequest {
  message: string
  sessionId?: number
  stream?: boolean
}

export interface ChatResponse {
  response: string
  session_id: number
  new_issues?: number
  issue_updates?: Record<string, any>
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}
