"use client"

import Link from "next/link"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [error, setError] = useState(() => {
    const urlError = searchParams.get('error')
    if (urlError === 'CredentialsSignin') {
      return 'Invalid credentials. Please try again.'
    }
    const message = searchParams.get('message')
    if (message === 'RegistrationSuccessful') {
      return 'Registration successful! Please log in.'
    }
    return ""
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/therapy')
      }
    } catch (error) {
      setError('An unexpected error occurred')
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
                ✨
              </div>
              <h3 className="font-bold text-xl">ورود به Niora</h3>
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
            <div className={`mb-4 p-3 border rounded-lg text-sm ${
              error.includes('successful')
                ? 'bg-green-50 border-green-200 text-green-600'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
              <input
                type="email"
                name="email"
                required
                disabled={isLoading}
                defaultValue={searchParams.get('email') || ''}
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
                disabled={isLoading}
                className="w-full px-4 py-3 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-gray-800 disabled:opacity-50"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-400 to-pink-400 text-white py-3 rounded-xl hover:from-rose-500 hover:to-pink-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "در حال ورود..." : "ورود"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            هنوز ثبت‌نام نکرده‌اید؟
            <Link href="/register" className="text-rose-500 hover:text-rose-600 font-medium mr-1">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-gray-600">در حال بارگذاری...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
