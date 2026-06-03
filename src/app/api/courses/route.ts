import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}
    if (category && category !== 'الكل') {
      where.category = category
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { instructor: { contains: search } }
      ]
    }

    const courses = await db.course.findMany({
      where,
      include: {
        lessons: { orderBy: { order: 'asc' } },
        quizzes: { include: { questions: true } },
        _count: { select: { enrollments: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Courses GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الدورات' }, { status: 500 })
  }
}
