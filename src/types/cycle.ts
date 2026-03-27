export interface MenstrualCycle {
  id: number
  user_id: number
  start_date: string
  end_date?: string
  pain_level: number
  symptoms?: string
  notes?: string
  created_at: string
}

export interface CycleStats {
  averageCycleLength: number
  nextPeriodDate: string | null
  currentStatus: 'period' | 'pms' | 'follicular' | 'unknown'
  daysUntilNextPeriod: number | null
}

export interface CalendarDay {
  day: number | null
  isPeriodDay: boolean
  isPMSDay: boolean
  isPredictedDay: boolean
  isToday: boolean
}

export interface CycleAlert {
  type: 'upcoming' | 'delayed' | 'pms'
  title: string
  message: string
  severity: 'info' | 'warning' | 'alert'
}

export type CyclePhase = 'period' | 'pms' | 'follicular' | 'ovulation' | 'luteal' | 'unknown'
