import { MenstrualCycle, CycleStats, CalendarDay, CycleAlert, CyclePhase } from '@/types/cycle'

// Persian month names for display
export const persianMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
]

// Calculate average cycle length from historical data
export function calculateAverageCycleLength(cycles: MenstrualCycle[]): number {
  if (cycles.length < 2) return 28 // Default cycle length

  const sortedCycles = [...cycles].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  )

  const cycleLengths: number[] = []
  for (let i = 1; i < sortedCycles.length; i++) {
    const prevDate = new Date(sortedCycles[i - 1].start_date)
    const currDate = new Date(sortedCycles[i].start_date)
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
    cycleLengths.push(diffDays)
  }

  if (cycleLengths.length === 0) return 28

  const average = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
  return Math.round(average)
}

// Predict next period date based on historical data
export function predictNextPeriod(cycles: MenstrualCycle[]): Date | null {
  if (cycles.length === 0) return null

  const lastCycle = cycles.reduce((latest, cycle) => {
    const latestDate = new Date(latest.start_date)
    const cycleDate = new Date(cycle.start_date)
    return cycleDate > latestDate ? cycle : latest
  }, cycles[0])

  const avgCycleLength = calculateAverageCycleLength(cycles)
  const nextPeriod = new Date(lastCycle.start_date)
  nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength)

  return nextPeriod
}

// Get current cycle phase
export function getCurrentCyclePhase(cycles: MenstrualCycle[]): CyclePhase {
  if (cycles.length === 0) return 'unknown'

  const lastCycle = cycles.reduce((latest, cycle) => {
    const latestDate = new Date(latest.start_date)
    const cycleDate = new Date(cycle.start_date)
    return cycleDate > latestDate ? cycle : latest
  }, cycles[0])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = new Date(lastCycle.start_date)
  startDate.setHours(0, 0, 0, 0)

  const endDate = lastCycle.end_date
    ? new Date(lastCycle.end_date)
    : new Date(startDate)
  endDate.setHours(0, 0, 0, 0)
  endDate.setDate(endDate.getDate() + 5) // Default 5-day period if no end date

  const avgCycleLength = calculateAverageCycleLength(cycles)
  const nextPeriod = new Date(startDate)
  nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength)

  const pmsStart = new Date(nextPeriod)
  pmsStart.setDate(pmsStart.getDate() - 7)

  // Check current phase
  if (today >= startDate && today <= endDate) {
    return 'period'
  } else if (today >= pmsStart && today < nextPeriod) {
    return 'pms'
  } else if (today < startDate) {
    return 'follicular'
  } else {
    return 'follicular'
  }
}

// Calculate cycle statistics
export function calculateCycleStats(cycles: MenstrualCycle[]): CycleStats {
  const averageCycleLength = calculateAverageCycleLength(cycles)
  const nextPeriodDate = predictNextPeriod(cycles)
  const currentPhase = getCurrentCyclePhase(cycles)

  let daysUntilNextPeriod: number | null = null
  if (nextPeriodDate) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = nextPeriodDate.getTime() - today.getTime()
    daysUntilNextPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const statusMap: Record<CyclePhase, CycleStats['currentStatus']> = {
    period: 'period',
    pms: 'pms',
    follicular: 'follicular',
    ovulation: 'follicular',
    luteal: 'follicular',
    unknown: 'unknown',
  }

  return {
    averageCycleLength,
    nextPeriodDate: nextPeriodDate ? nextPeriodDate.toISOString() : null,
    currentStatus: statusMap[currentPhase],
    daysUntilNextPeriod,
  }
}

// Generate calendar data for a specific month
export function generateCalendarData(
  year: number,
  month: number,
  cycles: MenstrualCycle[]
): CalendarDay[] {
  const calendarDays: CalendarDay[] = []

  if (cycles.length === 0) {
    // Return empty calendar with just day numbers
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDay = firstDay.getDay()
    const totalDays = lastDay.getDate()

    // Empty cells before first day
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push({
        day: null,
        isPeriodDay: false,
        isPMSDay: false,
        isPredictedDay: false,
        isToday: false,
      })
    }

    // Day cells
    const today = new Date()
    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()

      calendarDays.push({
        day,
        isPeriodDay: false,
        isPMSDay: false,
        isPredictedDay: false,
        isToday,
      })
    }

    return calendarDays
  }

  const avgCycleLength = calculateAverageCycleLength(cycles)
  const lastCycle = cycles.reduce((latest, cycle) => {
    const latestDate = new Date(latest.start_date)
    const cycleDate = new Date(cycle.start_date)
    return cycleDate > latestDate ? cycle : latest
  }, cycles[0])

  const periodDays: number[] = []
  const pmsDays: number[] = []
  const predictedDays: number[] = []

  // Get actual period days from all cycles
  cycles.forEach((cycle) => {
    const startDate = new Date(cycle.start_date)
    const endDate = cycle.end_date ? new Date(cycle.end_date) : new Date(startDate)
    endDate.setDate(endDate.getDate() + 5) // Add 5 days if no end date

    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      if (
        currentDate.getMonth() === month &&
        currentDate.getFullYear() === year
      ) {
        periodDays.push(currentDate.getDate())
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  // Predict next period
  const lastPeriodStart = new Date(lastCycle.start_date)
  const nextPeriodStart = new Date(lastPeriodStart)
  nextPeriodStart.setDate(nextPeriodStart.getDate() + avgCycleLength)

  const pmsStart = new Date(nextPeriodStart)
  pmsStart.setDate(pmsStart.getDate() - 7)

  let currentDate = new Date(pmsStart)
  while (currentDate <= nextPeriodStart) {
    if (
      currentDate.getMonth() === month &&
      currentDate.getFullYear() === year
    ) {
      if (currentDate < nextPeriodStart) {
        pmsDays.push(currentDate.getDate())
      } else {
        const predictedEnd = new Date(nextPeriodStart)
        predictedEnd.setDate(predictedEnd.getDate() + 5)
        if (currentDate <= predictedEnd) {
          predictedDays.push(currentDate.getDate())
        }
      }
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Build calendar
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startingDay = firstDay.getDay()
  const totalDays = lastDay.getDate()

  // Empty cells before first day
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push({
      day: null,
      isPeriodDay: false,
      isPMSDay: false,
      isPredictedDay: false,
      isToday: false,
    })
  }

  // Day cells
  const today = new Date()
  for (let day = 1; day <= totalDays; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()

    calendarDays.push({
      day,
      isPeriodDay: periodDays.includes(day),
      isPMSDay: pmsDays.includes(day),
      isPredictedDay: predictedDays.includes(day),
      isToday,
    })
  }

  return calendarDays
}

// Check for cycle alerts
export function checkCycleAlerts(cycles: MenstrualCycle[]): CycleAlert | null {
  if (cycles.length === 0) return null

  const nextPeriod = predictNextPeriod(cycles)
  if (!nextPeriod) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const daysUntil = Math.ceil(
    (nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Upcoming period (0-3 days)
  if (daysUntil >= 0 && daysUntil <= 3) {
    return {
      type: 'upcoming',
      title: '⏰ نزدیک به دوران قاعدگی!',
      message: `قاعدگی شما احتمالاً در ${daysUntil === 0 ? 'امروز' : daysUntil + ' روز دیگر'} شروع می‌شود. آماده باشید و از خودتون مراقبت کنید.`,
      severity: 'warning',
    }
  }

  // Delayed period (1-5 days late)
  if (daysUntil < 0 && Math.abs(daysUntil) <= 5) {
    return {
      type: 'delayed',
      title: '⏰ قاعدگی با تاخیر',
      message: `قاعدگی شما ${Math.abs(daysUntil)} روز تاخیر دارد. اگر تاخیر بیش از حد بود، با پزشک مشورت کنید.`,
      severity: 'alert',
    }
  }

  // PMS window (4-10 days before)
  if (daysUntil >= 4 && daysUntil <= 10) {
    return {
      type: 'pms',
      title: '🌸 دوره PMS',
      message: 'شما در دوره پیش از قاعدگی هستید. ممکن است تغییرات خلق و خو داشته باشید. از خودتون مراقبت کنید.',
      severity: 'info',
    }
  }

  return null
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fa-IR', {
    month: 'long',
    day: 'numeric',
  })
}

// Get Persian month name
export function getPersianMonth(month: number): string {
  return persianMonths[month] || persianMonths[0]
}
