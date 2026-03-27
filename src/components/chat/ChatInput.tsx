import { useState, FormEvent, KeyboardEvent } from "react"
import { Send, Mic } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "هرچه می‌خواهد دل تنگت بگو..."
}: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (message.trim() && !disabled) {
        onSendMessage(message.trim())
        setMessage("")
      }
    }
    // Allow new line with Shift+Enter
    // This is default behavior, so we don't need to handle it
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-5 py-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none transition-all overflow-y-auto text-gray-800"
          dir="rtl"
          disabled={disabled}
          rows={2}
          style={{ minHeight: "60px", maxHeight: "180px" }}
        />
        <div className="absolute bottom-2 left-2 text-xs text-gray-400">
          Enter برای ارسال • Shift+Enter برای خط جدید
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => alert('ویژگی ورودی صوتی به زودی اضافه خواهد شد!')}
            className="p-3 bg-purple-50 hover:bg-purple-100 rounded-full text-purple-600 transition-colors border border-purple-200 disabled:opacity-50"
            disabled={disabled}
            title="ورودی صوتی"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="bg-gradient-to-r from-rose-400 to-pink-400 text-white px-8 py-3 rounded-full hover:from-rose-500 hover:to-pink-500 transition-all duration-200 flex items-center space-x-reverse space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-medium">ارسال پیام</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  )
}
