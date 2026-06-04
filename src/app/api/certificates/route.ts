import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { validateQuery, getCertificatesQuerySchema } from '@/lib/validators'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { withAuthRateLimit } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // 1. Auth + Rate limit (combined)
    const authResult = await withAuthRateLimit(request, 'certificates', RATE_LIMITS.certificates)
    if (authResult.error) return authResult.error
    const { userId } = authResult

    // 2. Parse and validate query params
    const { searchParams } = new URL(request.url)
    const paramsObj: Record<string, string> = {}
    searchParams.forEach((value, key) => { paramsObj[key] = value })
    const queryValidation = validateQuery(getCertificatesQuerySchema, paramsObj)
    if (!queryValidation.success) return queryValidation.error

    const { email } = queryValidation.data

    // 3. Fetch certificates — only for the authenticated user's enrollments
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
