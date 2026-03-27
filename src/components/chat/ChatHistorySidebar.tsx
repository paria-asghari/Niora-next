"use client"

import { useState, useEffect } from "react"
import { useChatStore } from "@/stores/chatStore"
import { MessageSquare, Clock, Trash2, Plus, CheckSquare, Square } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { faIR } from "date-fns/locale"

export function ChatHistorySidebar({ isOpen, onClose, onNewChat, onSelectSession }: {
  isOpen: boolean
  onClose: () => void
  onNewChat: () => void
  onSelectSession: (sessionId: number) => void
}) {
  const { sessions, currentSession, setSessions, setCurrentSession } = useChatStore()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSessions, setSelectedSessions] = useState<Set<number>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadSessions()
    }
  }, [isOpen])

  const loadSessions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/sessions")
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error("Error loading sessions:", error)
      setSessions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm("آیا از حذف این چت مطمئن هستید؟")) return
    
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        // Remove from local state
        setSessions(sessions.filter(s => s.id !== sessionId))
        
        // If deleted session was current, clear current session
        if (currentSession?.id === sessionId) {
          setCurrentSession(null)
        }
        
        // Remove from selection if selected
        setSelectedSessions(prev => {
          const newSet = new Set(prev)
          newSet.delete(sessionId)
          return newSet
        })
      }
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  const toggleSessionSelection = (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSessions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId)
      } else {
        newSet.add(sessionId)
      }
      return newSet
    })
  }

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedSessions(new Set())
  }

  const handleBulkDelete = async () => {
    if (selectedSessions.size === 0) return
    
    const count = selectedSessions.size
    if (!confirm(`آیا از حذف ${count} چت مطمئن هستید؟`)) return
    
    try {
      const response = await fetch("/api/sessions/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionIds: Array.from(selectedSessions)
        }),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log("Bulk delete result:", result)
        
        // Remove from local state
        setSessions(sessions.filter(s => !selectedSessions.has(s.id)))
        
        // Clear current session if it was deleted
        if (currentSession && selectedSessions.has(currentSession.id)) {
          setCurrentSession(null)
        }
        
        // Clear selection
        setSelectedSessions(new Set())
        setIsSelectionMode(false)
      } else {
        throw new Error("Bulk delete failed")
      }
    } catch (error) {
      console.error("Error bulk deleting sessions:", error)
      alert("خطا در حذف چت‌ها. لطفاً دوباره تلاش کنید.")
    }
  }

  const handleSelectSession = (sessionId: number) => {
    if (isSelectionMode) return
    onSelectSession(sessionId)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="flex-1 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">تاریخچه چت‌ها</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onNewChat}
              className="flex-1 flex items-center justify-center space-x-reverse space-x-2 bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>چت جدید</span>
            </button>
            
            {sessions.length > 0 && (
              <button
                onClick={toggleSelectionMode}
                className={`flex items-center justify-center space-x-reverse space-x-2 py-2 px-4 rounded-lg transition-colors ${
                  isSelectionMode 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isSelectionMode ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>انصراف</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    <span>انتخاب</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          {isSelectionMode && selectedSessions.size > 0 && (
            <div className="mt-3 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedSessions.size} چت انتخاب شده
              </span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-reverse space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>حذف گروهی</span>
              </button>
            </div>
          )}
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center text-gray-500 py-8">
              در حال بارگذاری...
            </div>
          ) : !Array.isArray(sessions) || sessions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>هنوز چتی نداری</p>
              <p className="text-sm mt-1">اولین چت خودتو شروع کن</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    currentSession?.id === session.id
                      ? "bg-rose-50 border border-rose-200"
                      : isSelectionMode
                      ? selectedSessions.has(session.id)
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50 border border-transparent"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-reverse space-x-2 flex-1 min-w-0">
                      {isSelectionMode && (
                        <button
                          onClick={(e) => toggleSessionSelection(session.id, e)}
                          className="mt-1 flex-shrink-0"
                        >
                          {selectedSessions.has(session.id) ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">
                          {session.title || "چت بدون عنوان"}
                        </h3>
                        <div className="flex items-center space-x-reverse space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(session.started_at), {
                              addSuffix: true,
                              locale: faIR
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {!isSelectionMode && (
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1 flex-shrink-0"
                        title="حذف چت"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
