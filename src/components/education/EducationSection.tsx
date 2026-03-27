'use client'

import { educationArticles } from '@/lib/educationContent'
import { EducationCard } from './EducationCard'
import { BookOpen } from 'lucide-react'

export function EducationSection() {
  return (
    <section className="py-8 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-reverse space-x-2 mb-3">
              <BookOpen className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-800">آگاهی و آموزش</h2>
            </div>
            <p className="text-gray-600 text-sm">
              اطلاعات مفید و کاربردی درباره عادت ماهانه و PMS
            </p>
          </div>

          {/* Education Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationArticles.map((article) => (
              <EducationCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
