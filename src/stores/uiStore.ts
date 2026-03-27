import { create } from 'zustand'

interface UIStore {
  // Modal states
  authPromptModalOpen: boolean
  logPeriodModalOpen: boolean
  historyModalOpen: boolean
  educationModalOpen: boolean
  selectedArticleId: string | null

  // UI state
  welcomeBannerDismissed: boolean
  relaxationExpanded: boolean
  currentMonth: Date

  // Actions
  setAuthPromptModalOpen: (open: boolean) => void
  setLogPeriodModalOpen: (open: boolean) => void
  setHistoryModalOpen: (open: boolean) => void
  setEducationModalOpen: (open: boolean, articleId?: string) => void
  dismissWelcomeBanner: () => void
  toggleRelaxation: () => void
  setCurrentMonth: (date: Date) => void
  navigateMonth: (direction: 'prev' | 'next') => void
}

export const useUIStore = create<UIStore>((set, get) => {
  // Load welcome banner dismissal from localStorage
  const welcomeBannerDismissed =
    typeof window !== 'undefined'
      ? localStorage.getItem('welcomeBannerDismissed') === 'true'
      : false

  return {
    // Initial state
    authPromptModalOpen: false,
    logPeriodModalOpen: false,
    historyModalOpen: false,
    educationModalOpen: false,
    selectedArticleId: null,
    welcomeBannerDismissed,
    relaxationExpanded: false,
    currentMonth: new Date(),

    // Actions
    setAuthPromptModalOpen: (open: boolean) =>
      set({ authPromptModalOpen: open }),

    setLogPeriodModalOpen: (open: boolean) =>
      set({ logPeriodModalOpen: open }),

    setHistoryModalOpen: (open: boolean) =>
      set({ historyModalOpen: open }),

    setEducationModalOpen: (open: boolean, articleId?: string) =>
      set({
        educationModalOpen: open,
        selectedArticleId: articleId || null,
      }),

    dismissWelcomeBanner: () => {
      localStorage.setItem('welcomeBannerDismissed', 'true')
      set({ welcomeBannerDismissed: true })
    },

    toggleRelaxation: () =>
      set((state) => ({ relaxationExpanded: !state.relaxationExpanded })),

    setCurrentMonth: (date: Date) => set({ currentMonth: date }),

    navigateMonth: (direction: 'prev' | 'next') => {
      const { currentMonth } = get()
      const newMonth = new Date(currentMonth)

      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1)
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1)
      }

      set({ currentMonth: newMonth })
    },
  }
})
