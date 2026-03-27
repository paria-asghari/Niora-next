'use client'

import { yogaExercises } from '@/lib/educationContent'

export function YogaExercises() {
  const handleExerciseClick = (title: string) => {
    alert(`شروع تمرین یوگا: ${title}\n\nاین ویژگی به زودی با ویدیوهای آموزشی کامل می‌شود!`)
  }

  return (
    <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
      <div className="flex items-center space-x-reverse space-x-3 mb-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <i className="fas fa-spa text-rose-500"></i>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 text-sm">تمرینات یوگا</h4>
          <p className="text-xs text-gray-600">حرکات ملایم برای آرامش</p>
        </div>
      </div>
      <div className="space-y-2">
        {yogaExercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => handleExerciseClick(exercise.title)}
            className="yoga-exercise bg-white rounded-lg p-3 cursor-pointer hover:bg-rose-100 transition-colors border border-rose-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-xs text-gray-800">
                  {exercise.title}
                </h5>
                <p className="text-xs text-gray-500">{exercise.duration}</p>
              </div>
              <i className="fas fa-play text-rose-400 text-sm"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
