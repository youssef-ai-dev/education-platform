import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateQuery, getCoursesQuerySchema } from '@/lib/validators'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { withRateLimit } from '@/lib/auth'
import { transformCourse, getStudentsCountBatch, buildCourseWhereClause } from '@/lib/api-helpers'

// Courses listing is public (no auth required) — users should see courses before signing up

export async function GET(request: NextRequest) {
  try {
    // 1. Rate limiting only (public route, no auth)
    const rateLimitResult = await withRateLimit(request, 'courses', RATE_LIMITS.courses)
    if (rateLimitResult.error) return rateLimitResult.error

    // 2. Parse and validate query params
    const { searchParams } = new URL(request.url)
    const paramsObj: Record<string, string> = {}
    searchParams.forEach((value, key) => { paramsObj[key] = value })
    const queryValidation = validateQuery(getCoursesQuerySchema, paramsObj)
    if (!queryValidation.success) return queryValidation.error

    const { category, search } = queryValidation.data

    // 3. Build where clause with proper types
    const where = buildCourseWhereClause(category, search)

    // 4. Fetch from database
    const courses = await db.course.findMany({
      where,
      include: {
        lessons: { orderBy: { order: 'asc' } },
        quizzes: { include: { questions: true } },
        enrollments: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    // 5. Get real students counts from DB (batch query for efficiency)
    const courseIds = courses.map(c => c.id)
    const countsMap = await getStudentsCountBatch(courseIds)

    const result = courses.map(course =>
      transformCourse(course, countsMap.get(course.id) || 0)
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Courses GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الدورات' }, { status: 500 })
  }
}
