"use client"

import { useState, useEffect, useRef } from "react"
import { useChatStore } from "@/stores/chatStore"
import { ChatMessage } from "./ChatMessage"
import { StreamingMessage } from "./StreamingMessage"
import { TypingIndicator } from "./TypingIndicator"
import { ChatInput } from "./ChatInput"
import { ChatHistorySidebar } from "./ChatHistorySidebar"
import { Plus, History, LogOut } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

export function ChatContainer() {
  const [streamingContent, setStreamingContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()

  const {
    messages,
    currentSession,
    setCurrentSession,
    setMessages,
    addMessage,
    setIsLoading,
    setError,
    clearError,
    error,
  } = useChatStore()

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    chatMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent])

  const handleNewChat = () => {
    setCurrentSession(null)
    setMessages([])
    setShowHistory(false)
  }

  const handleSelectSession = async (sessionId: number) => {
    try {
      // Load session messages
      const response = await fetch(`/api/sessions/${sessionId}`)
      if (response.ok) {
        const sessionData = await response.json()
        setCurrentSession(sessionData.session)
        setMessages(sessionData.messages || [])
      }
    } catch (error) {
      console.error("Error loading session:", error)
      setError("خطا در بارگذاری چت")
    }
  }

  // Show loading while session is being determined
  if (status === 'loading') {
    return (
      <div className="flex flex-col h-screen bg-rose-50 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-6 h-6 bg-rose-400 rounded-full"></div>
          </div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!session?.user) {
    return (
      <div className="flex flex-col h-screen bg-rose-50 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">دسترسی غیرمجاز</h2>
          <p className="text-gray-600 mb-4">برای استفاده از چت، لطفاً وارد حساب کاربری خود شوید</p>
          <a
            href="/login"
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            ورود به حساب
          </a>
        </div>
      </div>
    )
  }

  const handleSendMessage = async (messageText: string) => {
    if (isStreaming) return

    // Debug: Check authentication status
    console.log('Session:', session)
    console.log('User ID:', session?.user?.id)

    // Add user message immediately
    const userMessage: any = {
      id: Date.now(),
      session_id: currentSession?.id || 0,
      user_id: 0,
      content: messageText,
      is_from_user: true,
      timestamp: new Date(),
    }
    addMessage(userMessage)

    setIsStreaming(true)
    setStreamingContent("")

    try {
      const response = await fetch("/api/chat/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          sessionId: currentSession?.id || null,
        }),
      })

      // Debug: Check response status
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        
        if (response.status === 401) {
          setError("برای استفاده از چت، لطفاً وارد حساب کاربری خود شوید")
        } else {
          setError(`خطا در ارسال پیام: ${response.status}`)
        }
        throw new Error(`Failed to get response: ${response.status} - ${errorText}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        let fullContent = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            console.log('Received chunk:', chunk)

            // Parse the streaming response format from AI SDK
            const lines = chunk.split('\n')
            for (const line of lines) {
              if (line.startsWith('0:')) {
                // Extract content between quotes and properly decode newlines
                const match = line.match(/0:"([^"]*)"/)
                if (match && match[1]) {
                  // Decode escaped characters including newlines
                  const content = match[1]
                    .replace(/\\n/g, '\n')
                    .replace(/\\"/g, '"')
                    .replace(/\\\\/g, '\\')
                  
                  fullContent += content
                  console.log('Added content:', JSON.stringify(content))
                  console.log('Full content so far:', JSON.stringify(fullContent))
                  setStreamingContent(fullContent)
                }
              } else if (line.startsWith('d:')) {
                // End of stream
                console.log('Stream ended')
                break
              }
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error)
        }

        console.log('Final fullContent:', fullContent)
        
        // Add AI message to store
        if (fullContent.trim()) {
          const aiMessage: any = {
            id: Date.now() + 1,
            session_id: currentSession?.id || 0,
            user_id: 0,
            content: fullContent,
            is_from_user: false,
            timestamp: new Date(),
          }
          console.log('Adding AI message:', aiMessage)
          addMessage(aiMessage)
        }

        // Update current session if it was new
        if (!currentSession) {
          const sessionResponse = await fetch("/api/sessions", {
            method: "POST",
          })
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json()
            setCurrentSession({ id: sessionData.session_id } as any)
            console.log('Set new current session:', sessionData.session_id)
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setError("خطا در ارسال پیام. لطفاً دوباره تلاش کنید.")
    } finally {
      setIsStreaming(false)
      setStreamingContent("")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-rose-50">
      {/* Header */}
      <div className="gradient-bg text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                ❤️
              </div>
              <div>
                <h3 className="font-semibold">Niora - همراه تراپیست شما</h3>
                <p className="text-xs opacity-90">فضای امن و محرمانه</p>
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-2">
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all flex items-center space-x-reverse space-x-2"
              >
                <History className="w-4 h-4" />
                <span>تاریخچه</span>
              </button>
              <button
                onClick={handleNewChat}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all flex items-center space-x-reverse space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>چت جدید</span>
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all flex items-center space-x-reverse space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-rose-50/50 to-pink-50/30 chat-messages">
        {/* Error Message */}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <p>{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-red-600 hover:text-red-800 underline text-xs"
              >
                بستن
              </button>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex justify-end">
            <div className="max-w-xs lg:max-w-md mr-auto">
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-rose-100">
                <div className="flex items-start space-x-reverse space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                    ❤️
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-medium mb-2">
                      سلام عزیزم، خوشحالم که اینجویی ❤️
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      اینجا فضای امن خودته. می‌تونی هرچی تو دلته رو بگی — من بدون قضاوت گوش می‌دم و کمکت می‌کنم. از چه چیزی می‌خوای شروع کنیم؟
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Streaming Message */}
        {isStreaming && streamingContent && (
          <StreamingMessage content={streamingContent} isComplete={false} />
        )}

        {/* Typing Indicator */}
        {isStreaming && !streamingContent && <TypingIndicator />}

        <div ref={chatMessagesRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-rose-100 bg-white p-5">
        <ChatInput onSendMessage={handleSendMessage} disabled={isStreaming} />
      </div>

      {/* Chat History Sidebar */}
      <ChatHistorySidebar
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
      />
    </div>
  )
}
