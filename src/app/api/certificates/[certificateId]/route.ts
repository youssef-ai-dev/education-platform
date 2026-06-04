import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    // 1. Require authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // 2. Rate limiting
    const identifier = getRateLimitIdentifier(request, userId)
    const rateLimit = checkRateLimit(identifier, 'certificates-detail', RATE_LIMITS.certificates)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      )
    }

    const { certificateId } = await params

    // 3. Validate certificateId
    if (!certificateId || certificateId.length > 200) {
      return NextResponse.json({ error: 'معرف الشهادة غير صالح' }, { status: 400 })
    }

    // 4. Fetch certificate with enrollment to verify ownership
    const cert = await db.certificate.findUnique({
      where: { certificateId },
      include: { enrollment: true },
    })

    if (!cert) {
      return NextResponse.json({ error: 'الشهادة غير موجودة' }, { status: 404 })
    }

    // 5. Verify the authenticated user owns this certificate
    if (cert.enrollment.userId !== userId) {
      return NextResponse.json({ error: 'ليس لديك صلاحية الوصول لهذه الشهادة' }, { status: 403 })
    }

    return NextResponse.json({
      ...cert,
      completedAt: cert.completedAt.toISOString(),
      enrollment: undefined, // Don't leak enrollment details
    })
  } catch (error) {
    console.error('Certificate GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الشهادة' }, { status: 500 })
  }
}
