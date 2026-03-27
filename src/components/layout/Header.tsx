'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { UserMenu } from './UserMenu'
import AuthButtons from './AuthButtons'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-reverse space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Niora</h1>
              <p className="text-xs opacity-90">همراه تراپیست شما</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-reverse space-x-4">
            <Link
              href={session ? "/therapy" : "/register"}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all duration-200"
            >
              تراپی
            </Link>
            <Link
              href="/moonflow"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all duration-200"
            >
              Moon Flow
            </Link>
          </nav>

          {/* Auth Section */}
          {session ? <UserMenu session={session} /> : <AuthButtons />}
        </div>
      </div>
    </header>
  )
}
