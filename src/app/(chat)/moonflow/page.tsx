"use client"

import { useState } from "react"
import { Moon } from "lucide-react"
import { CycleTracker } from "@/components/cycle/CycleTracker"
import { EducationSection } from "@/components/education/EducationSection"
import { RelaxationSection } from "@/components/relaxation/RelaxationSection"
import { AuthPromptModal } from "@/components/modals/AuthPromptModal"
import { HistoryModal } from "@/components/modals/HistoryModal"
import { EducationModal } from "@/components/education/EducationModal"
import { LogPeriodModal } from "@/components/cycle/LogPeriodModal"

export default function MoonFlowPage() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "سلام عزیزم، خوشحالم که اینجویی 🌙\n\nاینجا فضای شخصی و امن خودته برای دوران قاعدگی و PMS. من می‌تونم بر اساس حالتت، پیشنهادهای شخصی برات آماده کنم.\n\nالان چه حسی داری؟ یا چه علائمی تجربه می‌کنی؟",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (messageText: string) => {
    setMessages((prev) => [...prev, { role: "user", content: messageText }])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat/moonflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <AuthPromptModal />
      <HistoryModal />
      <EducationModal />
      <LogPeriodModal />

      {/* Chat Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center space-x-reverse space-x-2 mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Moon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Moon Flow
                </h2>
              </div>
              <p className="text-gray-600">همراه ماهانه شما - فضای امن و شخصی</p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => {
                  const element = document.getElementById('cycle-tracker')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="feature-card bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-4 transition-all duration-200 border border-purple-200 text-center shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-calendar-alt text-white text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">تقویم چرخه</h3>
                <p className="text-xs text-gray-600">ردیابی و پیش‌بینی</p>
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById('education-section')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="feature-card bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 rounded-xl p-4 transition-all duration-200 border border-pink-200 text-center shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-book-open text-white text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">آموزش</h3>
                <p className="text-xs text-gray-600">مقالات آموزشی</p>
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById('relaxation-section')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="feature-card bg-gradient-to-br from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 rounded-xl p-4 transition-all duration-200 border border-rose-200 text-center shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-spa text-white text-xl"></i>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">آرامش</h3>
                <p className="text-xs text-gray-600">یوگا و موزیک</p>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white rounded-xl shadow-sm border border-purple-100 mb-4" style={{ minHeight: "400px", maxHeight: "500px" }}>
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md ${
                    message.role === "user" ? "mr-auto" : "ml-auto"
                  }`}>
                    <div
                      className={`rounded-2xl p-4 shadow-sm border ${
                        message.role === "user"
                          ? "bg-purple-100 border-purple-200 rounded-br-sm"
                          : "bg-white border-purple-100 rounded-bl-sm"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-start space-x-reverse space-x-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Moon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md ml-auto">
                    <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-purple-100">
                      <div className="typing-indicator flex items-center space-x-reverse space-x-1">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (input.trim() && !isLoading) {
                  handleSendMessage(input.trim())
                }
              }}
              className="space-y-4"
            >
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='برام بنویس: مثلاً "کمردرد دردناک دارم" یا "حس افسردگی و پریشانی می‌کنم"...'
                  className="w-full px-5 py-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none transition-all overflow-y-auto"
                  dir="rtl"
                  disabled={isLoading}
                  rows={2}
                  style={{ minHeight: "60px", maxHeight: "180px" }}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-reverse space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-medium">ارسال پیام</span>
                  <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Cycle Tracker Section */}
      <div id="cycle-tracker">
        <CycleTracker />
      </div>

      {/* Education Section */}
      <div id="education-section">
        <EducationSection />
      </div>

      {/* Relaxation Section */}
      <div id="relaxation-section">
        <RelaxationSection />
      </div>
    </div>
  )
}
