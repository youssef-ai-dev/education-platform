// Legacy wrapper around Prisma database for course data.
// New code should import from @/lib/api-helpers and @/lib/types instead.
// User management handled by Clerk.

import { db } from '@/lib/db'
import { transformCourse, transformEnrollmentDetail, getStudentsCount, buildCourseWhereClause } from '@/lib/api-helpers'
import type {
  StaticLesson,
  StaticQuizQuestion,
  StaticQuiz,
  StaticEnrollment,
  StaticCourse,
} from './types-legacy'

// Re-export legacy types for backward compatibility
export type { StaticLesson, StaticQuizQuestion, StaticQuiz, StaticEnrollment, StaticCourse }

export async function getCourses(category?: string, search?: string): Promise<StaticCourse[]> {
  const where = buildCourseWhereClause(category, search)

  const courses = await db.course.findMany({
    where,
    include: {
      lessons: { orderBy: { order: 'asc' } },
      quizzes: { include: { questions: true } },
      enrollments: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const result: StaticCourse[] = []
  for (const course of courses) {
    const studentsCount = await getStudentsCount(course.id)
    result.push(transformCourse(course, studentsCount) as unknown as StaticCourse)
  }

  return result
}

export async function getCourseById(id: string): Promise<StaticCourse | undefined> {
  const course = await db.course.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: 'asc' } },
      quizzes: { include: { questions: true } },
      enrollments: true,
    },
  })

  if (!course) return undefined

  const studentsCount = await getStudentsCount(course.id)
  return transformCourse(course, studentsCount) as unknown as StaticCourse
}

export async function getEnrollments(userId: string) {
  const enrollments = await db.enrollment.findMany({
    where: {
      OR: [
        { userId },
        { studentEmail: userId },
      ]
    },
    include: {
      course: {
        include: {
          lessons: { orderBy: { order: 'asc' } },
          quizzes: { include: { questions: true } },
          enrollments: true,
        },
      },
      quizAttempts: true,
      certificate: true,
    },
    orderBy: { enrolledAt: 'desc' },
  })

  const result = []
  for (const e of enrollments) {
    const studentsCount = e.course ? await getStudentsCount(e.course.id) : 0
    result.push(transformEnrollmentDetail(e, studentsCount))
  }
  return result
}

export async function createEnrollment(data: { userId: string; studentName: string; studentEmail: string; courseId: string }) {
  const existing = await db.enrollment.findFirst({
    where: { userId: data.userId, courseId: data.courseId },
  })
  if (existing) return { error: 'أنت مسجل بالفعل في هذه الدورة', enrollment: existing }

  const course = await db.course.findUnique({ where: { id: data.courseId } })
  if (!course) return { error: 'الدورة غير موجودة' }

  const enrollment = await db.enrollment.create({
    data: {
      userId: data.userId,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      courseId: data.courseId,
      progress: 0,
    },
  })

  return {
    enrollment: {
      ...enrollment,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      completedAt: enrollment.completedAt ? enrollment.completedAt.toISOString() : null,
      course,
    }
  }
}

export async function updateEnrollmentProgress(id: string, progress: number) {
  const enrollment = await db.enrollment.findUnique({ where: { id } })
  if (!enrollment) return null

  const updated = await db.enrollment.update({
    where: { id },
    data: {
      progress,
      completedAt: progress >= 100 ? new Date() : enrollment.completedAt,
    },
  })

  return {
    ...updated,
    enrolledAt: updated.enrolledAt.toISOString(),
    completedAt: updated.completedAt ? updated.completedAt.toISOString() : null,
  }
}

export async function createQuizAttempt(data: { enrollmentId: string; quizId: string; answers: number[]; score: number; passed: boolean }) {
  const attempt = await db.quizAttempt.create({
    data: {
      enrollmentId: data.enrollmentId,
      quizId: data.quizId,
      score: data.score,
      passed: data.passed,
      answers: JSON.stringify(data.answers),
    },
  })

  return {
    ...attempt,
    answers: attempt.answers,
    completedAt: attempt.completedAt.toISOString(),
  }
}

export async function getCertificates(userId: string) {
  const enrollments = await db.enrollment.findMany({
    where: {
      OR: [
        { userId },
        { studentEmail: userId },
      ]
    },
    include: { certificate: true },
  })

  return enrollments
    .filter(e => e.certificate)
    .map(e => ({
      ...e.certificate!,
      completedAt: e.certificate!.completedAt.toISOString(),
    }))
}

export async function getCertificateByCertificateId(certificateId: string) {
  const cert = await db.certificate.findUnique({
    where: { certificateId },
  })

  if (!cert) return null

  return {
    ...cert,
    completedAt: cert.completedAt.toISOString(),
  }
}

export async function generateCertificate(enrollmentId: string) {
  const enrollment = await db.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true },
  })

  if (!enrollment) return { error: 'التسجيل غير موجود' }

  const existingCert = await db.certificate.findUnique({
    where: { enrollmentId },
  })
  if (existingCert) {
    return {
      certificate: {
        ...existingCert,
        completedAt: existingCert.completedAt.toISOString(),
      }
    }
  }

  // Update enrollment to completed
  await db.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress: 100,
      completedAt: new Date(),
    },
  })

  const cert = await db.certificate.create({
    data: {
      enrollmentId,
      studentName: enrollment.studentName,
      courseTitle: enrollment.course?.title || '',
      instructor: enrollment.course?.instructor || '',
      certificateId: `CERT-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    },
  })

  return {
    certificate: {
      ...cert,
      completedAt: cert.completedAt.toISOString(),
    }
  }
}

export async function seedData() {
  // Seed is now handled by prisma/seed.ts
  // This function just verifies the data exists
  const courseCount = await db.course.count()
  return {
    message: 'البيانات التجريبية جاهزة',
    coursesCount: courseCount,
    seeded: true
  }
}
