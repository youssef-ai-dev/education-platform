/**
 * Shared API helpers for transforming Prisma data into API responses.
 * Centralizes the transform logic that was duplicated across route files.
 * Also provides the real students count from the database.
 */

import { db } from '@/lib/db'
import type {
  PrismaCourseWithRelations,
  PrismaEnrollmentWithRelations,
  PrismaLesson,
  PrismaQuiz,
  PrismaQuizQuestion,
  PrismaEnrollment,
  CourseWhereClause,
  ApiCourse,
  ApiLesson,
  ApiQuiz,
  ApiQuizQuestion,
  ApiEnrollment,
  ApiEnrollmentDetail,
} from './types'

// ─── Students Count ───────────────────────────────────────────
// Real count from the database — no fake hardcoded numbers

/**
 * Get the real number of students enrolled in a course.
 * Counts actual enrollment records from the database.
 */
export async function getStudentsCount(courseId: string): Promise<number> {
  return db.enrollment.count({ where: { courseId } })
}

/**
 * Get students counts for multiple courses efficiently.
 * Returns a Map of courseId → count.
 */
export async function getStudentsCountBatch(courseIds: string[]): Promise<Map<string, number>> {
  const counts = await db.enrollment.groupBy({
    by: ['courseId'],
    where: { courseId: { in: courseIds } },
    _count: { id: true },
  })

  const map = new Map<string, number>()
  for (const c of counts) {
    map.set(c.courseId, c._count.id)
  }
  // Ensure all requested IDs have an entry (default 0)
  for (const id of courseIds) {
    if (!map.has(id)) map.set(id, 0)
  }
  return map
}

// ─── Transform Functions ──────────────────────────────────────

function transformLesson(l: PrismaLesson): ApiLesson {
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    videoUrl: l.videoUrl,
    duration: l.duration,
    order: l.order,
    courseId: l.courseId,
    isFree: l.isFree,
  }
}

function transformQuizQuestion(qq: PrismaQuizQuestion): ApiQuizQuestion {
  return {
    id: qq.id,
    quizId: qq.quizId,
    question: qq.question,
    options: qq.options,
    correctAnswer: qq.correctAnswer,
    explanation: qq.explanation,
  }
}

function transformQuiz(q: PrismaQuiz): ApiQuiz {
  return {
    id: q.id,
    title: q.title,
    courseId: q.courseId,
    lessonId: q.lessonId,
    timeLimit: q.timeLimit,
    passingScore: q.passingScore,
    questions: q.questions.map(transformQuizQuestion),
    attempts: [],
  }
}

function transformEnrollment(e: PrismaEnrollment): ApiEnrollment {
  return {
    id: e.id,
    userId: e.userId,
    studentName: e.studentName,
    studentEmail: e.studentEmail,
    courseId: e.courseId,
    progress: e.progress,
    enrolledAt: e.enrolledAt.toISOString(),
    completedAt: e.completedAt ? e.completedAt.toISOString() : null,
  }
}

export function transformCourse(
  course: PrismaCourseWithRelations,
  studentsCount: number
): ApiCourse {
  return {
    id: course.id,
    title: course.title,
    description: course.description,
    category: course.category,
    thumbnailUrl: course.thumbnailUrl,
    instructor: course.instructor,
    duration: course.duration,
    rating: course.rating,
    studentsCount,
    price: course.price,
    level: course.level,
    createdAt: course.createdAt.toISOString(),
    lessons: course.lessons.map(transformLesson),
    quizzes: course.quizzes.map(transformQuiz),
    enrollments: course.enrollments.map(transformEnrollment),
    _count: { enrollments: studentsCount },
  }
}

export function transformEnrollmentDetail(
  e: PrismaEnrollmentWithRelations,
  studentsCount: number
): ApiEnrollmentDetail {
  return {
    id: e.id,
    userId: e.userId,
    studentName: e.studentName,
    studentEmail: e.studentEmail,
    courseId: e.courseId,
    progress: e.progress,
    enrolledAt: e.enrolledAt.toISOString(),
    completedAt: e.completedAt ? e.completedAt.toISOString() : null,
    course: e.course ? transformCourse(e.course, studentsCount) : null,
    quizAttempts: e.quizAttempts.map(qa => ({
      id: qa.id,
      enrollmentId: qa.enrollmentId,
      quizId: qa.quizId,
      score: qa.score,
      passed: qa.passed,
      answers: qa.answers,
      completedAt: qa.completedAt.toISOString(),
    })),
    certificate: e.certificate ? {
      id: e.certificate.id,
      enrollmentId: e.certificate.enrollmentId,
      studentName: e.certificate.studentName,
      courseTitle: e.certificate.courseTitle,
      instructor: e.certificate.instructor,
      completedAt: e.certificate.completedAt.toISOString(),
      certificateId: e.certificate.certificateId,
    } : null,
  }
}

// ─── Course Where Clause Builder ──────────────────────────────

export function buildCourseWhereClause(category?: string, search?: string): CourseWhereClause {
  const where: CourseWhereClause = {}
  if (category && category !== 'الكل') {
    where.category = category
  }
  if (search) {
    const s = search.toLowerCase()
    where.OR = [
      { title: { contains: s } },
      { description: { contains: s } },
      { instructor: { contains: s } },
    ]
  }
  return where
}
