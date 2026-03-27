"use server"

import { registerUser } from './lib/auth'

export async function registerUserAction(username: string, email: string, password: string) {
  try {
    await registerUser(username, email, password)
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    }
  }
}
