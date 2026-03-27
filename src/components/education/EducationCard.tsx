'use client'

import { EducationArticle } from '@/types/education'
import { useUIStore } from '@/stores/uiStore'

interface EducationCardProps {
  article: EducationArticle
}

const colorClasses = {
  purple: 'border-purple-100 hover:shadow-purple-100',
  pink: 'border-pink-100 hover:shadow-pink-100',
  rose: 'border-rose-100 hover:shadow-rose-100',
}

const bgColorClasses = {
  purple: 'bg-purple-100 text-purple-500',
  pink: 'bg-pink-100 text-pink-500',
  rose: 'bg-rose-100 text-rose-500',
}

const textColorClasses = {
  purple: 'text-purple-500',
  pink: 'text-pink-500',
  rose: 'text-rose-500',
}

export function EducationCard({ article }: EducationCardProps) {
  const { setEducationModalOpen } = useUIStore()

  const handleClick = () => {
    setEducationModalOpen(true, article.id)
  }

  return (
    <div
      onClick={handleClick}
      className={`education-card bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border ${colorClasses[article.color]} cursor-pointer`}
    >
      <div className="flex items-start space-x-reverse space-x-3">
        <div className={`w-12 h-12 ${bgColorClasses[article.color]} rounded-full flex items-center justify-center flex-shrink-0`}>
          <i className={`fas ${article.icon} text-xl`}></i>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">{article.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {article.preview}
          </p>
          <div className="mt-3 flex items-center text-xs">
            <span className={textColorClasses[article.color]}>بیشتر بخوانید</span>
            <i className="fas fa-arrow-left mr-1"></i>
          </div>
        </div>
      </div>
    </div>
  )
}
