import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Require authentication for API routes.
 * Returns the authenticated user's ID and email, or a 401 response.
 */
export async function requireAuth(request: NextRequest): Promise<
  | { userId: string; email: string; error: undefined }
  | { userId: undefined; email: undefined; error: NextResponse }
> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        userId: undefined,
        email: undefined,
        error: NextResponse.json(
          { error: 'يجب تسجيل الدخول أولاً' },
          { status: 401 }
        ),
      }
    }

    // Get user email from request headers (set by Clerk middleware)
    // or from the request body / query params as fallback
    const email = request.headers.get('x-clerk-user-email') || ''

    return { userId, email, error: undefined }
  } catch {
    return {
      userId: undefined,
      email: undefined,
      error: NextResponse.json(
        { error: 'خطأ في المصادقة' },
        { status: 401 }
      ),
    }
  }
}

/**
 * Verify that the authenticated user owns the given enrollment.
 * Returns the enrollment if valid, or an error response.
 */
export async function verifyEnrollmentOwnership(
  userId: string,
  enrollmentId: string
): Promise<{ authorized: boolean; error?: NextResponse }> {
  const { db } = await import('@/lib/db')

  const enrollment = await db.enrollment.findUnique({
    where: { id: enrollmentId },
    select: { userId: true },
  })

  if (!enrollment) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'التسجيل غير موجود' },
        { status: 404 }
      ),
    }
  }

  if (enrollment.userId !== userId) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'ليس لديك صلاحية الوصول لهذا التسجيل' },
        { status: 403 }
      ),
    }
  }

  return { authorized: true }
}
