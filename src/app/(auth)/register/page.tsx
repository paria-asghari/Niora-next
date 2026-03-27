"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { registerUserAction } from "@/auth-actions"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      // Register the user first
      const result = await registerUserAction(username, email, password)
      
      if (!result.success) {
        setError(result.error || "Registration failed")
        return
      }

      // After successful registration, sign in the user
      const signInResult = await signIn('credentials', {
        email,
        password,
        username,
        redirect: false
      })

      if (signInResult?.error) {
        setError("Registration successful but login failed. Please try logging in manually.")
        router.push('/login')
        return
      }

      // Redirect to therapy page on successful login
      router.push('/therapy')
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="bg-gradient-to-r from-rose-400 to-pink-400 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                👤
              </div>
              <h3 className="font-bold text-xl">ثبت‌نام در Niora</h3>
            </div>
            <Link
              href="/"
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            >
              ✕
            </Link>
          </div>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
              <input
                type="text"
                name="username"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-gray-800 disabled:opacity-50"
                placeholder="نام نمایشی شما"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
              <input
                type="email"
                name="email"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-gray-800 disabled:opacity-50"
                placeholder="your@email.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-gray-800 disabled:opacity-50"
                placeholder="حداقل ۶ کاراکتر"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-400 text-white py-3 rounded-xl hover:from-rose-500 hover:to-pink-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            قبلاً ثبت‌نام کرده‌اید؟
            <Link href="/login" className="text-rose-500 hover:text-rose-600 font-medium mr-1">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
