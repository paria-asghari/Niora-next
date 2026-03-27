import { create } from 'zustand'
import { MenstrualCycle, CycleStats } from '@/types/cycle'
import { calculateCycleStats } from '@/lib/cycleUtils'

interface CycleStore {
  cycles: MenstrualCycle[]
  stats: CycleStats | null
  isLoading: boolean
  error: string | null

  // Actions
  loadCycles: () => Promise<void>
  createCycle: (
    startDate: string,
    endDate: string | null,
    painLevel: number,
    symptoms: string | null,
    notes: string | null
  ) => Promise<boolean>
  updateCycle: (
    cycleId: number,
    data: {
      startDate?: string
      endDate?: string
      painLevel?: number
      symptoms?: string
      notes?: string
    }
  ) => Promise<boolean>
  deleteCycle: (cycleId: number) => Promise<boolean>
  calculateStats: () => void
  clearError: () => void
}

export const useCycleStore = create<CycleStore>((set, get) => ({
  // Initial state
  cycles: [],
  stats: null,
  isLoading: false,
  error: null,

  // Actions
  loadCycles: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/cycles')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load cycles')
      }

      set({ cycles: data.cycles || [], isLoading: false })
      get().calculateStats()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load cycles',
        isLoading: false,
      })
    }
  },

  createCycle: async (
    startDate: string,
    endDate: string | null,
    painLevel: number,
    symptoms: string | null,
    notes: string | null
  ) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate,
          endDate,
          painLevel,
          symptoms,
          notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create cycle')
      }

      // Reload cycles
      await get().loadCycles()
      return true
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create cycle',
        isLoading: false,
      })
      return false
    }
  },

  updateCycle: async (cycleId: number, data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/cycles/${cycleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update cycle')
      }

      // Reload cycles
      await get().loadCycles()
      return true
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update cycle',
        isLoading: false,
      })
      return false
    }
  },

  deleteCycle: async (cycleId: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`/api/cycles/${cycleId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete cycle')
      }

      // Reload cycles
      await get().loadCycles()
      return true
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete cycle',
        isLoading: false,
      })
      return false
    }
  },

  calculateStats: () => {
    const { cycles } = get()
    const stats = calculateCycleStats(cycles)
    set({ stats })
  },

  clearError: () => set({ error: null }),
}))
