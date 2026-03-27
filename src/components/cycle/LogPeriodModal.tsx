'use client'

import { useState } from 'react'
import { Modal } from '../modals/Modal'
import { useCycleStore } from '@/stores/cycleStore'
import { useUIStore } from '@/stores/uiStore'

export function LogPeriodModal() {
  const { logPeriodModalOpen, setLogPeriodModalOpen } = useUIStore()
  const { createCycle } = useCycleStore()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [painLevel, setPainLevel] = useState(3)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const success = await createCycle(
        startDate,
        endDate || null,
        painLevel,
        null, // symptoms
        null // notes
      )

      if (success) {
        setLogPeriodModalOpen(false)
        // Reset form
        setStartDate('')
        setEndDate('')
        setPainLevel(3)
      }
    } catch (error) {
      console.error('Error logging period:', error)
      alert('خطا در ثبت قاعدگی')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={logPeriodModalOpen}
      onClose={() => setLogPeriodModalOpen(false)}
      title="ثبت قاعدگی"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاریخ شروع
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاریخ پایان (اختیاری)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شدت درد (۱-۵)
          </label>
          <div className="flex items-center space-x-reverse space-x-2">
            <span className="text-sm text-gray-500">کم</span>
            <input
              type="range"
              min="1"
              max="5"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-sm text-gray-500">زیاد</span>
            <span className="text-sm font-medium text-purple-600 w-6">
              {painLevel}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !startDate}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'در حال ثبت...' : 'ثبت قاعدگی'}
        </button>
      </form>
    </Modal>
  )
}
