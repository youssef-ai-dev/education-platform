// Thin wrapper around Prisma database for course data
// In-memory storage removed - all data now comes from the database
// User management handled by Clerk

import { db } from '@/lib/db'

// Base enrollment counts for display purposes (simulated popularity)
export const BASE_ENROLLMENT_COUNTS: Record<string, number> = {
  'course-web-dev': 1250,
  'course-react': 2100,
  'course-figma': 890,
  'course-agile': 670,
  'course-english': 1580,
  'course-data': 980,
}

// Type exports for backward compatibility
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
  attempts: any[]
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

/**
 * Get students count dynamically from base counts + DB enrollments
 */
async function getStudentsCount(courseId: string): Promise<number> {
  const baseCount = BASE_ENROLLMENT_COUNTS[courseId] || 0
  const dbEnrollments = await db.enrollment.count({ where: { courseId } })
  return baseCount + dbEnrollments
}

/**
 * Transform a Prisma course (with included relations) into the StaticCourse shape
 * that the frontend expects.
 */
function transformCourse(
  course: any,
  studentsCount: number
): StaticCourse {
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
    lessons: (course.lessons || []).map((l: any) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      videoUrl: l.videoUrl,
      duration: l.duration,
      order: l.order,
      courseId: l.courseId,
      isFree: l.isFree,
    })),
    quizzes: (course.quizzes || []).map((q: any) => ({
      id: q.id,
      title: q.title,
      courseId: q.courseId,
      lessonId: q.lessonId,
      timeLimit: q.timeLimit,
      passingScore: q.passingScore,
      questions: (q.questions || []).map((qq: any) => ({
        id: qq.id,
        quizId: qq.quizId,
        question: qq.question,
        options: qq.options,
        correctAnswer: qq.correctAnswer,
        explanation: qq.explanation,
      })),
      attempts: [],
    })),
    enrollments: (course.enrollments || []).map((e: any) => ({
      id: e.id,
      userId: e.userId,
      studentName: e.studentName,
      studentEmail: e.studentEmail,
      courseId: e.courseId,
      progress: e.progress,
      enrolledAt: e.enrolledAt.toISOString(),
      completedAt: e.completedAt ? e.completedAt.toISOString() : null,
    })),
    _count: { enrollments: studentsCount },
  }
}

export async function getCourses(category?: string, search?: string): Promise<StaticCourse[]> {
  const where: any = {}
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
    result.push(transformCourse(course, studentsCount))
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
  return transformCourse(course, studentsCount)
}

// Enrollment functions — now using Prisma
export async function getEnrollments(userId: string) {
  // userId can be a Clerk ID or an email; support both
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
        },
      },
      quizAttempts: true,
      certificate: true,
    },
    orderBy: { enrolledAt: 'desc' },
  })

  return enrollments.map(e => ({
    id: e.id,
    userId: e.userId,
    studentName: e.studentName,
    studentEmail: e.studentEmail,
    courseId: e.courseId,
    progress: e.progress,
    enrolledAt: e.enrolledAt.toISOString(),
    completedAt: e.completedAt ? e.completedAt.toISOString() : null,
    course: e.course ? {
      ...e.course,
      createdAt: e.course.createdAt.toISOString(),
      updatedAt: e.course.updatedAt.toISOString(),
      lessons: e.course.lessons.map((l: any) => ({ ...l })),
      quizzes: e.course.quizzes.map((q: any) => ({
        ...q,
        questions: q.questions.map((qq: any) => ({ ...qq })),
        attempts: [],
      })),
      enrollments: [],
      studentsCount: BASE_ENROLLMENT_COUNTS[e.course.id] || 0,
      _count: { enrollments: BASE_ENROLLMENT_COUNTS[e.course.id] || 0 },
    } : null,
    quizAttempts: e.quizAttempts.map(qa => ({
      ...qa,
      answers: qa.answers,
      completedAt: qa.completedAt.toISOString(),
    })),
    certificate: e.certificate ? {
      ...e.certificate,
      completedAt: e.certificate.completedAt.toISOString(),
    } : null,
  }))
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

export async function createQuizAttempt(data: { enrollmentId: string; quizId: string; answers: any[]; score: number; passed: boolean }) {
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
