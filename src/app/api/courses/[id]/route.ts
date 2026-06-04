import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

const BASE_ENROLLMENT_COUNTS: Record<string, number> = {
  'course-web-dev': 1250,
  'course-react': 2100,
  'course-figma': 890,
  'course-agile': 670,
  'course-english': 1580,
  'course-data': 980,
}

// Course detail is public — users should see course info before enrolling

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(request)
    const rateLimit = checkRateLimit(identifier, 'courses-detail', RATE_LIMITS.courses)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      )
    }

    const { id } = await params

    // Validate ID
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

    const baseCount = BASE_ENROLLMENT_COUNTS[course.id] || 0
    const studentsCount = baseCount + course.enrollments.length

    const result = {
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

    return NextResponse.json(result)
  } catch (error) {
    console.error('Course GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الدورة' }, { status: 500 })
  }
}
