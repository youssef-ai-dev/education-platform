import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { validateBody, createQuizAttemptSchema } from '@/lib/validators'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/rate-limit'
import { verifyEnrollmentOwnership } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 1. Require authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // 2. Rate limiting
    const identifier = getRateLimitIdentifier(request, userId)
    const rateLimit = checkRateLimit(identifier, 'quiz-attempts', RATE_LIMITS.quizAttempts)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      )
    }

    // 3. Parse and validate input (score/passed NOT accepted from client)
    const body = await request.json()
    const validation = validateBody(createQuizAttemptSchema, body)
    if (!validation.success) return validation.error

    const { enrollmentId, quizId, answers } = validation.data

    // 4. Verify the user owns this enrollment
    const ownership = await verifyEnrollmentOwnership(userId, enrollmentId)
    if (!ownership.authorized) return ownership.error!

    // 5. Fetch the quiz with correct answers
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 })
    }

    // 6. Calculate score SERVER-SIDE
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

    // 7. Save the attempt
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
