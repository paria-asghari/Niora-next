export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  created_at: Date
  last_login?: Date
}

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface Session {
  user: AuthUser
  expires: string
}
