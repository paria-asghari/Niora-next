'use client'

import { useCycleStore } from '@/stores/cycleStore'
import { Bell } from 'lucide-react'
import { checkCycleAlerts } from '@/lib/cycleUtils'

export function AlertBanner() {
  const { cycles } = useCycleStore()
  const alert = checkCycleAlerts(cycles)

  if (!alert) return null

  const severityClasses = {
    info: 'bg-pink-400/30',
    warning: 'bg-yellow-400/30',
    alert: 'bg-orange-400/30',
  }

  return (
    <div
      className={`${severityClasses[alert.severity]} rounded-lg p-4 backdrop-blur-sm mb-4`}
    >
      <div className="flex items-start space-x-reverse space-x-3">
        <Bell className="text-yellow-300 text-xl mt-1" />
        <div>
          <p className="font-semibold text-sm text-white">{alert.title}</p>
          <p className="text-xs mt-1 text-white/90">{alert.message}</p>
        </div>
      </div>
    </div>
  )
}
