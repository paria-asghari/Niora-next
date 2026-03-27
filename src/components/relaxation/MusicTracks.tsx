'use client'

import { musicTracks } from '@/lib/educationContent'

export function MusicTracks() {
  const handleTrackClick = (title: string) => {
    alert(`پخش موزیک: ${title}\n\nاین ویژگی به زودی با پخش‌کننده موزیک کامل می‌شود!`)
  }

  return (
    <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
      <div className="flex items-center space-x-reverse space-x-3 mb-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <i className="fas fa-music text-rose-500"></i>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 text-sm">موزیک بی‌کلام</h4>
          <p className="text-xs text-gray-600">ملودی‌های آرامش‌بخش</p>
        </div>
      </div>
      <div className="space-y-2">
        {musicTracks.map((track) => (
          <div
            key={track.id}
            onClick={() => handleTrackClick(track.title)}
            className="music-track bg-white rounded-lg p-3 cursor-pointer hover:bg-rose-100 transition-colors border border-rose-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-xs text-gray-800">
                  {track.title}
                </h5>
                <p className="text-xs text-gray-500">{track.description}</p>
              </div>
              <i className="fas fa-play text-rose-400 text-sm"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
