import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { withRateLimit } from '@/lib/auth'
import { transformCourse, getStudentsCount } from '@/lib/api-helpers'

// Course detail is public — users should see course info before enrolling

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Rate limiting only (public route, no auth)
    const rateLimitResult = await withRateLimit(request, 'courses-detail', RATE_LIMITS.courses)
    if (rateLimitResult.error) return rateLimitResult.error

    const { id } = await params

    // 2. Validate ID
    if (!id || id.length > 100) {
      return NextResponse.json({ error: 'معرف الدورة غير صالح' }, { status: 400 })
    }

    const course = await db.course.findUnique({
      where: { id },
      include: {
        lessons: { orderBy: { order: 'asc' } },
        quizzes: { include: { questions: true } },
        enrollments: true,
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'الدورة غير موجودة' }, { status: 404 })
    }

    // 3. Real students count from database
    const studentsCount = await getStudentsCount(course.id)
    const result = transformCourse(course, studentsCount)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Course GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الدورة' }, { status: 500 })
  }
}
