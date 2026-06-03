import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const enrollments = await db.enrollment.findMany({
      where: { studentEmail: email },
      include: {
        course: {
          include: {
            lessons: { orderBy: { order: 'asc' } },
            quizzes: { include: { questions: true } }
          }
        },
        quizAttempts: { include: { quiz: true } },
        certificate: true
      },
      orderBy: { enrolledAt: 'desc' }
    })

    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Enrollments GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب التسجيلات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentName, studentEmail, courseId } = body

    if (!studentName || !studentEmail || !courseId) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    // Check if already enrolled
    const existing = await db.enrollment.findFirst({
      where: { studentEmail, courseId }
    })

    if (existing) {
      return NextResponse.json({ error: 'أنت مسجل بالفعل في هذه الدورة', enrollment: existing }, { status: 409 })
    }

    const enrollment = await db.enrollment.create({
      data: { studentName, studentEmail, courseId, progress: 0 },
      include: {
        course: { include: { lessons: true } }
      }
    })

    // Update students count
    await db.course.update({
      where: { id: courseId },
      data: { studentsCount: { increment: 1 } }
    })

    return NextResponse.json(enrollment, { status: 201 })
  } catch (error) {
    console.error('Enrollment POST error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء التسجيل' }, { status: 500 })
  }
}
