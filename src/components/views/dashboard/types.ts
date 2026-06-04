export interface Enrollment {
  id: string
  studentName: string
  studentEmail: string
  courseId: string
  progress: number
  enrolledAt: string
  completedAt: string | null
  course: {
    id: string
    title: string
    category: string
    thumbnailUrl: string | null
    instructor: string
    duration: string
    rating: number
    lessons: { id: string; title: string }[]
    quizzes: { id: string; title: string }[]
  }
  quizAttempts: { id: string; score: number; passed: boolean; quizId: string }[]
  certificate: { id: string; certificateId: string; courseTitle: string } | null
}
