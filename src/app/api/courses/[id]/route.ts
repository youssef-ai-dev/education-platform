import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const course = await db.course.findUnique({
      where: { id },
      include: {
        lessons: { orderBy: { order: 'asc' } },
        quizzes: {
          include: {
            questions: true,
            attempts: true
          }
        },
        enrollments: true
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'الدورة غير موجودة' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Course GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الدورة' }, { status: 500 })
  }
}
