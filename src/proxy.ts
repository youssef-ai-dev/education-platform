import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * Route matcher for API routes that require authentication.
 * Public routes (like courses listing and health check) are excluded.
 *
 * This proxy provides a defense-in-depth layer:
 * - Even if a route handler forgets to call withAuthRateLimit(),
 *   the proxy will block unauthenticated access.
 * - Route handlers still do their own auth for ownership checks and
 *   to get the userId — proxy just ensures a session exists.
 *
 * Note: In Next.js 16+, the "proxy" file convention replaces "middleware".
 */
const isProtectedApiRoute = createRouteMatcher([
  '/api/enrollments(.*)',
  '/api/quiz-attempts(.*)',
  '/api/certificates(.*)',
  '/api/generate-certificate(.*)',
  '/api/seed(.*)',
])

/**
 * Public API routes that don't require authentication
 * but should still have basic rate limiting via headers.
 */
const isPublicApiRoute = createRouteMatcher([
  '/api/courses(.*)',
  '/api(.*)', // Health check at /api
])

export default clerkMiddleware(async (auth, request) => {
  // ─── Protected API Routes: Require Authentication ───────────
  if (isProtectedApiRoute(request)) {
    // In development, allow seed endpoint through without auth
    if (request.nextUrl.pathname === '/api/seed' && process.env.NODE_ENV !== 'production') {
      return NextResponse.next()
    }

    const { userId } = await auth()

    // Block unauthenticated access to protected API routes
    if (!userId) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      )
    }

    // Add security headers for authenticated API responses
    const response = NextResponse.next()
    response.headers.set('X-Authenticated-User', userId)
    return response
  }

  // ─── All Other Routes: Pass Through ────────────────────────
  // Public API routes (/api/courses, /api health check)
  // and page routes are handled by Clerk's default behavior
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Match all paths except static files and _next internals
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always match API and tRPC routes
    '/(api|trpc)(.*)',
  ],
}
