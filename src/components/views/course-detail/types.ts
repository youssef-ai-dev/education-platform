export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  order: number
  isFree: boolean
}

export interface Quiz {
  id: string
  title: string
  timeLimit: number
  passingScore: number
  questions: { id: string }[]
}

export interface CourseDetail {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string | null
  instructor: string
  duration: string
  rating: number
  studentsCount: number
  price: number
  level: string
  lessons: Lesson[]
  quizzes: Quiz[]
  enrollments: { id: string; studentEmail: string; progress: number }[]
}
