'use client'

import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useUIStore } from '@/stores/uiStore'

export function WelcomeBanner() {
  const { welcomeBannerDismissed, dismissWelcomeBanner } = useUIStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || welcomeBannerDismissed) {
    return null
  }

  const handleDismiss = () => {
    dismissWelcomeBanner()
  }

  return (
    <section
      onClick={handleDismiss}
      className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 cursor-pointer hover:from-rose-100 hover:to-pink-100 transition-all"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-reverse space-x-2 text-gray-700">
          <Heart className="w-4 h-4 text-rose-400" />
          <p className="text-sm">
            فضایی امن برای درد و دل و تراپی — هرچه می‌خواهد دل تنگت بگو
          </p>
        </div>
      </div>
    </section>
  )
}
