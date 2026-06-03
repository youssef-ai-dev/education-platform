import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enrollmentId, quizId, answers, score, passed } = body

    if (!enrollmentId || !quizId || answers === undefined || score === undefined || passed === undefined) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const attempt = await db.quizAttempt.create({
      data: {
        enrollmentId,
        quizId,
        score,
        passed,
        answers: JSON.stringify(answers),
      },
      include: { quiz: true }
    })

    return NextResponse.json(attempt, { status: 201 })
  } catch (error) {
    console.error('Quiz attempt POST error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء حفظ نتيجة الاختبار' }, { status: 500 })
  }
}
