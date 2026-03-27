'use client'

import { Modal } from './Modal'
import { Trash2, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useUIStore } from '@/stores/uiStore'

export function HistoryModal() {
  const { historyModalOpen, setHistoryModalOpen } = useUIStore()
  const [sessions, setSessions] = useState<any[]>([])
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (historyModalOpen) {
      loadSessions()
    }
  }, [historyModalOpen])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/sessions')
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadSession = async (sessionId: number) => {
    try {
      // Navigate to therapy page with session
      window.location.href = `/therapy?session=${sessionId}`
    } catch (error) {
      console.error('Error loading session:', error)
    }
  }

  const handleDeleteSession = async (sessionId: number) => {
    setDeletingId(sessionId)
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Reload sessions
        await loadSessions()
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'همین الان'
    if (diffMins < 60) return `${diffMins} دقیقه پیش`
    if (diffHours < 24) return `${diffHours} ساعت پیش`
    if (diffDays < 7) return `${diffDays} روز پیش`
    return date.toLocaleDateString('fa-IR')
  }

  return (
    <Modal
      isOpen={historyModalOpen}
      onClose={() => setHistoryModalOpen(false)}
      title="تاریخچه گفتگوها"
      showCloseButton={true}
    >
      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 py-8">
            <p>در حال بارگذاری...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>هنوز گفتگویی نداشته‌اید</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1 text-sm">
                    {session.title || 'چت بدون عنوان'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {getRelativeTime(session.started_at.toString())}
                  </p>
                </div>
                <div className="flex items-center space-x-reverse space-x-2">
                  <button
                    onClick={() => handleLoadSession(session.id)}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    مشاهده
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    disabled={deletingId === session.id}
                    className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}
