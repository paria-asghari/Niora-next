export function TypingIndicator() {
  return (
    <div className="flex justify-end">
      <div className="max-w-xs lg:max-w-md mr-auto">
        <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border border-rose-100">
          <div className="flex items-center space-x-reverse space-x-2">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
