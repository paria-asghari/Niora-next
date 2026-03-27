export type ColorVariant = 'purple' | 'pink' | 'rose'

export interface EducationArticle {
  id: string
  title: string
  icon: string
  color: ColorVariant
  preview: string
  content: string
}

export interface YogaExercise {
  id: string
  title: string
  duration: string
  description: string
}

export interface MusicTrack {
  id: string
  title: string
  description: string
}
