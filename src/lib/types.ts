/**
 * Shared TypeScript types for API responses.
 * These match the Prisma model shapes with included relations,
 * replacing `any` with proper types throughout the codebase.
 */

// ─── Prisma Relation Types ────────────────────────────────────
// These represent what Prisma returns when using `include` with relations.
// We define them here so route handlers can use proper types instead of `any`.

export interface PrismaLesson {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: string
  order: number
  courseId: string
  isFree: boolean
}

export interface PrismaQuizQuestion {
  id: string
  quizId: string
  question: string
  options: string
  correctAnswer: number
  explanation: string
}

export interface PrismaQuiz {
  id: string
  title: string
  courseId: string
  lessonId: string | null
  timeLimit: number
  passingScore: number
  questions: PrismaQuizQuestion[]
}

export interface PrismaEnrollment {
  id: string
  userId: string
  studentName: string
  studentEmail: string
  courseId: string
  progress: number
  enrolledAt: Date
  completedAt: Date | null
}

export interface PrismaQuizAttempt {
  id: string
  enrollmentId: string
  quizId: string
  score: number
  passed: boolean
  answers: string
  completedAt: Date
}

export interface PrismaCertificate {
  id: string
  enrollmentId: string
  studentName: string
  courseTitle: string
  instructor: string
  completedAt: Date
  certificateId: string
}

export interface PrismaCourseWithRelations {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string | null
  instructor: string
  duration: string
  rating: number
  price: number
  level: string
  createdAt: Date
  updatedAt: Date
  lessons: PrismaLesson[]
  quizzes: PrismaQuiz[]
  enrollments: PrismaEnrollment[]
}

export interface PrismaEnrollmentWithRelations {
  id: string
  userId: string
  studentName: string
  studentEmail: string
  courseId: string
  progress: number
  enrolledAt: Date
  completedAt: Date | null
  course: PrismaCourseWithRelations | null
  quizAttempts: PrismaQuizAttempt[]
  certificate: PrismaCertificate | null
}

// ─── API Response Types ───────────────────────────────────────
// These are the serialized shapes sent to the client (Dates → strings).

export interface ApiLesson {
  id: string
  title: string
  description: string
  videoUrl: string
  duration: string
  order: number
  courseId: string
  isFree: boolean
}

export interface ApiQuizQuestion {
  id: string
  quizId: string
  question: string
  options: string
  correctAnswer: number
  explanation: string
}

export interface ApiQuiz {
  id: string
  title: string
  courseId: string
  lessonId: string | null
  timeLimit: number
  passingScore: number
  questions: ApiQuizQuestion[]
  attempts: never[]
}

export interface ApiEnrollment {
  id: string
  userId: string
  studentName: string
  studentEmail: string
  courseId: string
  progress: number
  enrolledAt: string
  completedAt: string | null
}

export interface ApiCourse {
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
  lessons: ApiLesson[]
  quizzes: ApiQuiz[]
  enrollments: ApiEnrollment[]
  _count: { enrollments: number }
}

export interface ApiEnrollmentDetail {
  id: string
  userId: string
  studentName: string
  studentEmail: string
  courseId: string
  progress: number
  enrolledAt: string
  completedAt: string | null
  course: ApiCourse | null
  quizAttempts: {
    id: string
    enrollmentId: string
    quizId: string
    score: number
    passed: boolean
    answers: string
    completedAt: string
  }[]
  certificate: {
    id: string
    enrollmentId: string
    studentName: string
    courseTitle: string
    instructor: string
    completedAt: string
    certificateId: string
  } | null
}

// ─── Prisma Where Clause Type ─────────────────────────────────
// For course filtering — replaces `any` in where clause

export interface CourseWhereClause {
  category?: string
  OR?: Array<
    | { title: { contains: string } }
    | { description: { contains: string } }
    | { instructor: { contains: string } }
  >
}
