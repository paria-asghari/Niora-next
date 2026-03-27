import { Message } from "@/stores/chatStore"
import { Heart } from "lucide-react"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.is_from_user

  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-end'} message-bubble`}>
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'ml-auto' : 'mr-auto'}`}>
        <div className={`rounded-2xl p-4 shadow-sm border ${
          isUser
            ? 'bg-rose-100 border-rose-200 rounded-tr-sm'
            : 'bg-white border-rose-100 rounded-tl-sm'
        }`}>
          {!isUser && (
            <div className="flex items-start space-x-reverse space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  )
}
