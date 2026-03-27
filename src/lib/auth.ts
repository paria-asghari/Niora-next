import { compare, hash } from 'bcryptjs'
import { getUserByEmail, createUser, updateLastLogin } from './db'

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export async function registerUser(username: string, email: string, password: string) {
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new Error('کاربر با این ایمیل قبلاً ثبت‌نام کرده')
  }

  const passwordHash = await hashPassword(password)
  const result = await createUser(username, email, passwordHash)

  return result
}

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) {
    return null
  }

  await updateLastLogin(user.id)

  return {
    id: user.id.toString(),
    email: user.email,
    name: user.username,
  }
}
