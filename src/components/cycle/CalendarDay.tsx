interface CalendarDayProps {
  day: number | null
  isPeriodDay: boolean
  isPMSDay: boolean
  isPredictedDay: boolean
  isToday: boolean
}

export function CalendarDay({
  day,
  isPeriodDay,
  isPMSDay,
  isPredictedDay,
  isToday,
}: CalendarDayProps) {
  if (day === null) {
    return <div className="p-2"></div>
  }

  let classes =
    'p-2 text-center rounded-lg text-sm transition-all cursor-pointer '

  if (isPeriodDay) {
    classes += 'bg-purple-500 text-white font-medium hover:bg-purple-600'
  } else if (isPredictedDay) {
    classes += 'bg-purple-200 text-purple-700 font-medium hover:bg-purple-300'
  } else if (isPMSDay) {
    classes += 'bg-pink-300 text-pink-700 hover:bg-pink-400'
  } else if (isToday) {
    classes +=
      'bg-rose-100 text-rose-600 font-bold border-2 border-rose-300 hover:bg-rose-200'
  } else {
    classes += 'hover:bg-purple-50 text-gray-700'
  }

  return <div className={classes}>{day}</div>
}
