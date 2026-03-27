'use client'

import { useUIStore } from '@/stores/uiStore'
import { YogaExercises } from './YogaExercises'
import { MusicTracks } from './MusicTracks'
import { Flower, ChevronDown } from 'lucide-react'

export function RelaxationSection() {
  const { relaxationExpanded, toggleRelaxation } = useUIStore()

  return (
    <section className="py-6 bg-white border-t border-rose-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Collapsible Header */}
          <button
            onClick={toggleRelaxation}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:from-rose-100 hover:to-pink-100 transition-all duration-200"
          >
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <Flower className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-right">
                <h3 className="font-medium text-gray-800 text-sm">
                  ابزارهای آرامش
                </h3>
                <p className="text-xs text-gray-600">
                  تمرینات یوگا و موزیک‌های بی‌کلام
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                relaxationExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Collapsible Content */}
          <div
            className={`mt-4 relaxation-content ${
              relaxationExpanded ? 'block' : 'hidden'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <YogaExercises />
              <MusicTracks />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
