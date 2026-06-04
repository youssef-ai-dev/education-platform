import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS, type RateLimitOptions } from '@/lib/rate-limit'

// ─── Auth Helper ──────────────────────────────────────────────

/**
 * Require authentication for API routes.
 * Returns the authenticated user's ID, or a 401 response.
 */
export async function requireAuth(): Promise<
  | { userId: string; error: undefined }
  | { userId: undefined; error: NextResponse }
> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        userId: undefined,
        error: NextResponse.json(
          { error: 'يجب تسجيل الدخول أولاً' },
          { status: 401 }
        ),
      }
    }

    return { userId, error: undefined }
  } catch {
    return {
      userId: undefined,
      error: NextResponse.json(
        { error: 'خطأ في المصادقة' },
        { status: 401 }
      ),
    }
  }
}

// ─── Ownership Verification ───────────────────────────────────

/**
 * Verify that the authenticated user owns the given enrollment.
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

// ─── Combined Auth + Rate Limit Helper ────────────────────────

/**
 * Combined authentication and rate limiting check.
 * Use this at the top of protected API route handlers instead of
 * calling auth() + checkRateLimit() separately every time.
 *
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const authResult = await withAuthRateLimit(request, 'quiz-attempts', RATE_LIMITS.quizAttempts)
 *   if (authResult.error) return authResult.error
 *   const { userId } = authResult
 *   // ... route logic
 * }
 * ```
 */
export async function withAuthRateLimit(
  request: NextRequest,
  routeName: string,
  rateLimitConfig: RateLimitOptions
): Promise<
  | { userId: string; error: undefined }
  | { userId: undefined; error: NextResponse }
> {
  // 1. Authentication
  const authResult = await requireAuth()
  if (authResult.error) return authResult

  // 2. Rate limiting
  const identifier = getRateLimitIdentifier(request, authResult.userId)
  const rateLimit = await checkRateLimit(identifier, routeName, rateLimitConfig)
  if (!rateLimit.allowed) {
    return {
      userId: undefined,
      error: NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      ),
    }
  }

  return { userId: authResult.userId, error: undefined }
}

/**
 * Rate limit only (for public routes that don't need auth).
 *
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const rateLimitResult = await withRateLimit(request, 'courses', RATE_LIMITS.courses)
 *   if (rateLimitResult.error) return rateLimitResult.error
 *   // ... route logic
 * }
 * ```
 */
export async function withRateLimit(
  request: NextRequest,
  routeName: string,
  rateLimitConfig: RateLimitOptions
): Promise<{ error: undefined } | { error: NextResponse }> {
  const identifier = getRateLimitIdentifier(request)
  const rateLimit = await checkRateLimit(identifier, routeName, rateLimitConfig)
  if (!rateLimit.allowed) {
    return {
      error: NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      ),
    }
  }

  return { error: undefined }
}
