import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { RATE_LIMITS } from '@/lib/rate-limit'
import { withAuthRateLimit } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    // 1. Auth + Rate limit (combined)
    const authResult = await withAuthRateLimit(request, 'certificates-detail', RATE_LIMITS.certificates)
    if (authResult.error) return authResult.error
    const { userId } = authResult

    const { certificateId } = await params

    // 2. Validate certificateId
    if (!certificateId || certificateId.length > 200) {
      return NextResponse.json({ error: 'معرف الشهادة غير صالح' }, { status: 400 })
    }

    // 3. Fetch certificate with enrollment to verify ownership
    const cert = await db.certificate.findUnique({
      where: { certificateId },
      include: { enrollment: true },
    })

    if (!cert) {
      return NextResponse.json({ error: 'الشهادة غير موجودة' }, { status: 404 })
    }

    // 4. Verify the authenticated user owns this certificate
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
