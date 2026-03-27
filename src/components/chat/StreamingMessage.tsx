import { Heart } from "lucide-react"
import { useEffect, useRef } from "react"

interface StreamingMessageProps {
  content: string
  isComplete: boolean
}

export function StreamingMessage({ content, isComplete }: StreamingMessageProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [content])

  return (
    <div className="flex justify-end message-bubble">
      <div className="max-w-xs lg:max-w-md mr-auto">
        <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-rose-100">
          <div className="flex items-start space-x-reverse space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
            {!isComplete && <span className="animate-pulse">▊</span>}
          </p>
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}
