'use client'

import { CalendarDay } from './CalendarDay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { generateCalendarData, getPersianMonth } from '@/lib/cycleUtils'
import { useCycleStore } from '@/stores/cycleStore'

export function Calendar() {
  const { currentMonth, navigateMonth } = useUIStore()
  const { cycles } = useCycleStore()

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const calendarDays = generateCalendarData(year, month, cycles)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5 mb-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-purple-500" />
        </button>
        <h4 className="font-bold text-gray-800">
          {getPersianMonth(month)} {year}
        </h4>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-purple-500" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((day) => (
          <div
            key={day}
            className="text-center text-xs text-gray-500 font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <CalendarDay
            key={`${day.day}-${index}`}
            day={day.day}
            isPeriodDay={day.isPeriodDay}
            isPMSDay={day.isPMSDay}
            isPredictedDay={day.isPredictedDay}
            isToday={day.isToday}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-reverse space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-xs text-gray-600">روزهای قاعدگی</span>
        </div>
        <div className="flex items-center space-x-reverse space-x-2">
          <div className="w-4 h-4 bg-pink-300 rounded"></div>
          <span className="text-xs text-gray-600">روزهای PMS</span>
        </div>
        <div className="flex items-center space-x-reverse space-x-2">
          <div className="w-4 h-4 bg-purple-200 rounded"></div>
          <span className="text-xs text-gray-600">پیش‌بینی قاعدگی</span>
        </div>
      </div>
    </div>
  )
}
