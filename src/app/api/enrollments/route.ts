import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateBody, validateQuery, createEnrollmentSchema, getEnrollmentsQuerySchema } from '@/lib/validators'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { withAuthRateLimit } from '@/lib/auth'
import { transformEnrollmentDetail, getStudentsCountBatch } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  try {
    // 1. Auth + Rate limit (combined)
    const authResult = await withAuthRateLimit(request, 'enrollments-get', RATE_LIMITS.enrollments)
    if (authResult.error) return authResult.error
    const { userId } = authResult

    // 2. Parse and validate query params
    const { searchParams } = new URL(request.url)
    const paramsObj: Record<string, string> = {}
    searchParams.forEach((value, key) => { paramsObj[key] = value })
    const queryValidation = validateQuery(getEnrollmentsQuerySchema, paramsObj)
    if (!queryValidation.success) return queryValidation.error

    const queryParams = queryValidation.data

    // 3. Use the authenticated user's ID — ignore client-supplied userId for security
    const lookupId = userId

    // 4. Fetch enrollments directly from Prisma
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
            enrollments: true,
          },
        },
        quizAttempts: true,
        certificate: true,
      },
      orderBy: { enrolledAt: 'desc' },
    })

    // 5. Get real students counts (batch for efficiency)
    const courseIds = enrollments
      .map(e => e.course?.id)
      .filter((id): id is string => !!id)
    const countsMap = await getStudentsCountBatch(courseIds)

    // 6. Transform with proper types (no `any`)
    const result = enrollments.map(e =>
      transformEnrollmentDetail(e, e.course ? (countsMap.get(e.course.id) || 0) : 0)
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Enrollments GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب التسجيلات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Auth + Rate limit (combined)
    const authResult = await withAuthRateLimit(request, 'enrollments-post', RATE_LIMITS.enrollments)
    if (authResult.error) return authResult.error
    const { userId } = authResult

    // 2. Parse and validate input
    const body = await request.json()
    const validation = validateBody(createEnrollmentSchema, body)
    if (!validation.success) return validation.error

    const { studentName, studentEmail, courseId } = validation.data

    // 3. Use the authenticated user's ID — ignore client-supplied userId for security
    const actualUserId = userId

    // 4. Check for existing enrollment
    const existing = await db.enrollment.findFirst({
      where: { userId: actualUserId, courseId },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'أنت مسجل بالفعل في هذه الدورة', enrollment: existing },
        { status: 409 }
      )
    }

    // 5. Verify course exists
    const course = await db.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json({ error: 'الدورة غير موجودة' }, { status: 404 })
    }

    // 6. Create enrollment
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
