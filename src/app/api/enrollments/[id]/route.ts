import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { validateBody, updateEnrollmentSchema } from '@/lib/validators'
import { verifyEnrollmentOwnership } from '@/lib/auth'
import { reportError } from '@/lib/error-reporting'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Require authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // 2. Get enrollment ID
    const { id } = await params

    // 3. Verify the user owns this enrollment
    const ownership = await verifyEnrollmentOwnership(userId, id)
    if (!ownership.authorized) return ownership.error!

    // 4. Parse and validate input
    const body = await request.json()
    const validation = validateBody(updateEnrollmentSchema, body)
    if (!validation.success) return validation.error

    const { progress } = validation.data

    // 5. Update enrollment
    const enrollment = await db.enrollment.findUnique({ where: { id } })
    if (!enrollment) {
      return NextResponse.json({ error: 'التسجيل غير موجود' }, { status: 404 })
    }

    const updated = await db.enrollment.update({
      where: { id },
      data: {
        progress,
        completedAt: progress >= 100 ? new Date() : enrollment.completedAt,
      },
    })

    return NextResponse.json({
      ...updated,
      enrolledAt: updated.enrolledAt.toISOString(),
      completedAt: updated.completedAt ? updated.completedAt.toISOString() : null,
    })
  } catch (error) {
    reportError(error, { context: 'enrollment-patch', id })
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث التقدم' }, { status: 500 })
  }
}
