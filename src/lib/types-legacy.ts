/**
 * Legacy type exports for backward compatibility.
 * New code should use types from @/lib/types instead.
 */

export interface StaticLesson {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: string
  order: number
  courseId: string
  isFree: boolean
}

export interface StaticQuizQuestion {
  id: string
  quizId: string
  question: string
  options: string
  correctAnswer: number
  explanation: string
}

export interface StaticQuiz {
  id: string
  title: string
  courseId: string
  lessonId: string | null
  timeLimit: number
  passingScore: number
  questions: StaticQuizQuestion[]
  attempts: never[]
}

export interface StaticEnrollment {
  id: string
  userId: string
  studentName: string
  studentEmail: string
  courseId: string
  progress: number
  enrolledAt: string
  completedAt: string | null
}

export interface StaticCourse {
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
  createdAt: string
  lessons: StaticLesson[]
  quizzes: StaticQuiz[]
  enrollments: StaticEnrollment[]
  _count: { enrollments: number }
}
