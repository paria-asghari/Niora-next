'use client'

import { useUIStore } from '@/stores/uiStore'
import { educationArticles } from '@/lib/educationContent'

export function EducationModal() {
  const { educationModalOpen, selectedArticleId, setEducationModalOpen } =
    useUIStore()

  const selectedArticle = educationArticles.find(
    (article) => article.id === selectedArticleId
  )

  if (!selectedArticle) return null

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 modal-backdrop ${
        educationModalOpen ? 'block' : 'hidden'
      }`}
      onClick={() => setEducationModalOpen(false)}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`bg-gradient-to-r from-${selectedArticle.color}-500 to-pink-500 text-white p-5 rounded-t-2xl`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className={`fas ${selectedArticle.icon}`}></i>
              </div>
              <h3 className="font-bold text-lg">{selectedArticle.title}</h3>
            </div>
            <button
              onClick={() => setEducationModalOpen(false)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 prose prose-sm max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />
        </div>
      </div>
    </div>
  )
}
