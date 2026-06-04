import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateBody, createQuizAttemptSchema } from '@/lib/validators'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { withAuthRateLimit, verifyEnrollmentOwnership } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 1. Auth + Rate limit (combined)
    const authResult = await withAuthRateLimit(request, 'quiz-attempts', RATE_LIMITS.quizAttempts)
    if (authResult.error) return authResult.error
    const { userId } = authResult

    // 2. Parse and validate input (score/passed NOT accepted from client)
    const body = await request.json()
    const validation = validateBody(createQuizAttemptSchema, body)
    if (!validation.success) return validation.error

    const { enrollmentId, quizId, answers } = validation.data

    // 3. Verify the user owns this enrollment
    const ownership = await verifyEnrollmentOwnership(userId, enrollmentId)
    if (!ownership.authorized) return ownership.error!

    // 4. Fetch the quiz with correct answers
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 })
    }

    // 5. Calculate score SERVER-SIDE
    const totalQuestions = quiz.questions.length
    if (totalQuestions === 0) {
      return NextResponse.json({ error: 'الاختبار لا يحتوي على أسئلة' }, { status: 400 })
    }

    let correctCount = 0
    for (let i = 0; i < totalQuestions; i++) {
      const question = quiz.questions[i]
      const userAnswer = answers[i]
      if (userAnswer === question.correctAnswer) {
        correctCount++
      }
    }

    const score = Math.round((correctCount / totalQuestions) * 100)
    const passed = score >= quiz.passingScore

    // 6. Save the attempt
    const attempt = await db.quizAttempt.create({
      data: {
        enrollmentId,
        quizId,
        score,
        passed,
        answers: JSON.stringify(answers),
      },
    })

    return NextResponse.json({
      ...attempt,
      answers: attempt.answers,
      completedAt: attempt.completedAt.toISOString(),
    }, { status: 201 })
  } catch (error) {
    console.error('Quiz attempt POST error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء حفظ نتيجة الاختبار' }, { status: 500 })
  }
}
