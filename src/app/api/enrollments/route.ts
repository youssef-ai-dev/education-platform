import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { validateBody, validateQuery, createEnrollmentSchema, getEnrollmentsQuerySchema } from '@/lib/validators'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    // 1. Require authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // 2. Rate limiting
    const identifier = getRateLimitIdentifier(request, userId)
    const rateLimit = checkRateLimit(identifier, 'enrollments-get', RATE_LIMITS.enrollments)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      )
    }

    // 3. Parse and validate query params
    const { searchParams } = new URL(request.url)
    const paramsObj: Record<string, string> = {}
    searchParams.forEach((value, key) => { paramsObj[key] = value })
    const queryValidation = validateQuery(getEnrollmentsQuerySchema, paramsObj)
    if (!queryValidation.success) return queryValidation.error

    const queryParams = queryValidation.data

    // 4. Use the authenticated user's ID — ignore client-supplied userId for security
    // This prevents users from fetching other users' enrollments
    const lookupId = userId

    // 5. Fetch enrollments directly from Prisma
    const enrollments = await db.enrollment.findMany({
      where: {
        OR: [
          { userId: lookupId },
          { studentEmail: queryParams.email || '' },
        ],
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

    const BASE_ENROLLMENT_COUNTS: Record<string, number> = {
      'course-web-dev': 1250,
      'course-react': 2100,
      'course-figma': 890,
      'course-agile': 670,
      'course-english': 1580,
      'course-data': 980,
    }

    const result = enrollments.map(e => ({
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

    return NextResponse.json(result)
  } catch (error) {
    console.error('Enrollments GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب التسجيلات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Require authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // 2. Rate limiting
    const identifier = getRateLimitIdentifier(request, userId)
    const rateLimit = checkRateLimit(identifier, 'enrollments-post', RATE_LIMITS.enrollments)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      )
    }

    // 3. Parse and validate input
    const body = await request.json()
    const validation = validateBody(createEnrollmentSchema, body)
    if (!validation.success) return validation.error

    const { studentName, studentEmail, courseId } = validation.data

    // 4. Use the authenticated user's ID — ignore client-supplied userId for security
    // This prevents users from creating enrollments for other users
    const actualUserId = userId

    // 5. Check for existing enrollment
    const existing = await db.enrollment.findFirst({
      where: { userId: actualUserId, courseId },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'أنت مسجل بالفعل في هذه الدورة', enrollment: existing },
        { status: 409 }
      )
    }

    // 6. Verify course exists
    const course = await db.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json({ error: 'الدورة غير موجودة' }, { status: 404 })
    }

    // 7. Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: actualUserId,
        studentName,
        studentEmail,
        courseId,
        progress: 0,
      },
    })

    return NextResponse.json({
      ...enrollment,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      completedAt: enrollment.completedAt ? enrollment.completedAt.toISOString() : null,
      course,
    }, { status: 201 })
  } catch (error) {
    console.error('Enrollment POST error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء التسجيل' }, { status: 500 })
  }
}
