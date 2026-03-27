'use client'

import { Modal } from './Modal'
import Link from 'next/link'
import { useUIStore } from '@/stores/uiStore'

export function AuthPromptModal() {
  const { authPromptModalOpen, setAuthPromptModalOpen } = useUIStore()

  return (
    <Modal
      isOpen={authPromptModalOpen}
      onClose={() => setAuthPromptModalOpen(false)}
      title="وارد حساب کاربری خود شوید"
    >
      <div className="text-center space-y-4">
        <p className="text-gray-600">
          برای استفاده از این امکان، باید وارد حساب کاربری خود شوید
        </p>

        <div className="flex flex-col space-y-3">
          <Link
            href="/login"
            onClick={() => setAuthPromptModalOpen(false)}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all font-medium"
          >
            ورود به حساب
          </Link>
          <Link
            href="/register"
            onClick={() => setAuthPromptModalOpen(false)}
            className="w-full bg-white border-2 border-rose-300 text-rose-600 py-3 rounded-xl hover:bg-rose-50 transition-all font-medium"
          >
            ثبت‌نام
          </Link>
          <button
            onClick={() => setAuthPromptModalOpen(false)}
            className="w-full text-gray-500 hover:text-gray-700 py-2 transition-colors text-sm"
          >
            بعداً
          </button>
        </div>
      </div>
    </Modal>
  )
}
