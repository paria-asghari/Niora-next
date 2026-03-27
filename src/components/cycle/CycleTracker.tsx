'use client'

import { Calendar } from './Calendar'
import { LogPeriodModal } from './LogPeriodModal'
import { CycleStats } from './CycleStats'
import { AlertBanner } from './AlertBanner'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useCycleStore } from '@/stores/cycleStore'
import { useEffect } from 'react'

export function CycleTracker() {
  const { setLogPeriodModalOpen, setAuthPromptModalOpen } = useUIStore()
  const { loadCycles, cycles } = useCycleStore()

  useEffect(() => {
    // Load cycles when component mounts
    loadCycles()
  }, [loadCycles])

  const handleLogPeriod = () => {
    // The API will handle authentication check
    setLogPeriodModalOpen(true)
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Tracker Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 mb-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-reverse space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">ردیابی چرخه قاعدگی</h3>
                  <p className="text-xs opacity-90">ثبت و پیش‌بینی دوران قاعدگی</p>
                </div>
              </div>
              <button
                onClick={handleLogPeriod}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm transition-all flex items-center space-x-reverse space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>ثبت قاعدگی</span>
              </button>
            </div>

            <AlertBanner />
          </div>

          <Calendar />
          <CycleStats />
        </div>
      </div>

      <LogPeriodModal />
    </div>
  )
}
