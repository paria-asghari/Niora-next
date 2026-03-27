'use client'

import { useCycleStore } from '@/stores/cycleStore'
import { formatDate } from '@/lib/cycleUtils'

export function CycleStats() {
  const { stats } = useCycleStore()

  if (!stats) {
    return (
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 text-center">
          <p className="text-xs text-gray-600 mb-1">میانگین چرخه</p>
          <p className="text-2xl font-bold text-purple-600">-</p>
          <p className="text-xs text-gray-500">روز</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-100 text-center">
          <p className="text-xs text-gray-600 mb-1">قاعدگی بعدی</p>
          <p className="text-lg font-bold text-pink-600">-</p>
          <p className="text-xs text-gray-500">-</p>
        </div>
        <div className="bg-rose-50 rounded-lg p-4 border border-rose-100 text-center">
          <p className="text-xs text-gray-600 mb-1">وضعیت فعلی</p>
          <p className="text-lg font-bold text-rose-600">-</p>
          <p className="text-xs text-gray-500">-</p>
        </div>
      </div>
    )
  }

  const statusMap = {
    period: 'در دوران قاعدگی',
    pms: 'دوره PMS',
    follicular: 'فولیکولار (عادی)',
    unknown: 'اطلاعاتی ثبت نشده',
  }

  const nextPeriodText = stats.nextPeriodDate
    ? formatDate(stats.nextPeriodDate)
    : '-'

  const daysUntilText =
    stats.daysUntilNextPeriod !== null
      ? stats.daysUntilNextPeriod > 0
        ? `${stats.daysUntilNextPeriod} روز باقی مانده`
        : stats.daysUntilNextPeriod === 0
        ? 'امروز!'
        : `${Math.abs(stats.daysUntilNextPeriod)} روز تاخیر`
      : '-'

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 text-center">
        <p className="text-xs text-gray-600 mb-1">میانگین چرخه</p>
        <p className="text-2xl font-bold text-purple-600">
          {stats.averageCycleLength}
        </p>
        <p className="text-xs text-gray-500">روز</p>
      </div>

      <div className="bg-pink-50 rounded-lg p-4 border border-pink-100 text-center">
        <p className="text-xs text-gray-600 mb-1">قاعدگی بعدی</p>
        <p className="text-lg font-bold text-pink-600">{nextPeriodText}</p>
        <p className="text-xs text-gray-500">{daysUntilText}</p>
      </div>

      <div className="bg-rose-50 rounded-lg p-4 border border-rose-100 text-center">
        <p className="text-xs text-gray-600 mb-1">وضعیت فعلی</p>
        <p className="text-lg font-bold text-rose-600">
          {statusMap[stats.currentStatus]}
        </p>
        <p className="text-xs text-gray-500">
          {stats.currentStatus === 'unknown' ? '' : 'چرخه فعلی'}
        </p>
      </div>
    </div>
  )
}
