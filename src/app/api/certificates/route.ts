import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { validateQuery, getCertificatesQuerySchema } from '@/lib/validators'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    // 1. Require authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // 2. Rate limiting
    const identifier = getRateLimitIdentifier(request, userId)
    const rateLimit = checkRateLimit(identifier, 'certificates', RATE_LIMITS.certificates)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      )
    }

    // 3. Parse and validate query params
    const { searchParams } = new URL(request.url)
    const paramsObj: Record<string, string> = {}
    searchParams.forEach((value, key) => { paramsObj[key] = value })
    const queryValidation = validateQuery(getCertificatesQuerySchema, paramsObj)
    if (!queryValidation.success) return queryValidation.error

    const { email } = queryValidation.data

    // 4. Fetch certificates — only for the authenticated user's enrollments
    const enrollments = await db.enrollment.findMany({
      where: {
        OR: [
          { userId },
          { studentEmail: email },
        ],
      },
      include: { certificate: true },
    })

    const certificates = enrollments
      .filter(e => e.certificate)
      .map(e => ({
        ...e.certificate!,
        completedAt: e.certificate!.completedAt.toISOString(),
      }))

    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Certificates GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الشهادات' }, { status: 500 })
  }
}
