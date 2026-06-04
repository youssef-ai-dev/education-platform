import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateQuery, getCoursesQuerySchema } from '@/lib/validators'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

const BASE_ENROLLMENT_COUNTS: Record<string, number> = {
  'course-web-dev': 1250,
  'course-react': 2100,
  'course-figma': 890,
  'course-agile': 670,
  'course-english': 1580,
  'course-data': 980,
}

// Courses listing is public (no auth required) — users should see courses before signing up

export async function GET(request: NextRequest) {
  try {
    // Rate limiting (no userId needed for public routes)
    const identifier = getRateLimitIdentifier(request)
    const rateLimit = checkRateLimit(identifier, 'courses', RATE_LIMITS.courses)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      )
    }

    // Parse and validate query params
    const { searchParams } = new URL(request.url)
    const paramsObj: Record<string, string> = {}
    searchParams.forEach((value, key) => { paramsObj[key] = value })
    const queryValidation = validateQuery(getCoursesQuerySchema, paramsObj)
    if (!queryValidation.success) return queryValidation.error

    const { category, search } = queryValidation.data

    // Build where clause
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

    // Fetch from database directly
    const courses = await db.course.findMany({
      where,
      include: {
        lessons: { orderBy: { order: 'asc' } },
        quizzes: { include: { questions: true } },
        enrollments: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    const result = courses.map(course => {
      const baseCount = BASE_ENROLLMENT_COUNTS[course.id] || 0
      const studentsCount = baseCount + course.enrollments.length

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
        lessons: course.lessons.map(l => ({
          id: l.id,
          title: l.title,
          description: l.description,
          videoUrl: l.videoUrl,
          duration: l.duration,
          order: l.order,
          courseId: l.courseId,
          isFree: l.isFree,
        })),
        quizzes: course.quizzes.map(q => ({
          id: q.id,
          title: q.title,
          courseId: q.courseId,
          lessonId: q.lessonId,
          timeLimit: q.timeLimit,
          passingScore: q.passingScore,
          questions: q.questions.map(qq => ({
            id: qq.id,
            quizId: qq.quizId,
            question: qq.question,
            options: qq.options,
            correctAnswer: qq.correctAnswer,
            explanation: qq.explanation,
          })),
          attempts: [],
        })),
        enrollments: course.enrollments.map(e => ({
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
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Courses GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الدورات' }, { status: 500 })
  }
}
