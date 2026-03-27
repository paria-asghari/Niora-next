'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface StartChatButtonProps {
  className?: string
  variant?: 'primary' | 'secondary'
}

export function StartChatButton({ className = '', variant = 'primary' }: StartChatButtonProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className={`${className} animate-pulse bg-gray-200 rounded-full`}>
        <div className="px-8 py-4">
          <span className="text-transparent">در حال بارگذاری...</span>
        </div>
      </div>
    )
  }

  const href = session ? '/therapy' : '/register'
  const text = session ? 'ادامه گفتگو' : 'شروع گفتگو'

  if (variant === 'secondary') {
    return (
      <Link
        href={href}
        className={`flex items-center text-rose-500 hover:text-rose-600 ${className}`}
      >
        <span className="ml-2">{text}</span>
        <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className={`inline-flex bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl items-center space-x-reverse space-x-3 ${className}`}
    >
      <span>{text}</span>
      <ArrowRight className="w-5 h-5" />
    </Link>
  )
}
