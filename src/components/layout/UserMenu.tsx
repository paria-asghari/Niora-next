'use client'

import { useState } from 'react'
import { ChevronDown, Clock, LogOut, User } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useUIStore } from '@/stores/uiStore'

interface UserMenuProps {
  session: any
}

export function UserMenu({ session }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const setHistoryModalOpen = useUIStore((state) => state.setHistoryModalOpen)

  const handleShowHistory = () => {
    setIsOpen(false)
    setHistoryModalOpen(true)
  }

  const handleLogout = async () => {
    setIsOpen(false)
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-reverse space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all duration-200"
      >
        <User className="w-4 h-4" />
        <span>سلام، {session.user?.name || 'کاربر'}!</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <button
            onClick={handleShowHistory}
            className="w-full flex items-center space-x-reverse space-x-3 px-4 py-3 hover:bg-rose-50 transition-colors text-gray-700 text-right"
          >
            <Clock className="w-4 h-4 text-rose-500" />
            <span className="text-sm">تاریخچه گفتگوها</span>
          </button>

          <div className="border-t border-gray-100"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-reverse space-x-3 px-4 py-3 hover:bg-rose-50 transition-colors text-gray-700 text-right"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span className="text-sm">خروج</span>
          </button>
        </div>
      )}
    </div>
  )
}
