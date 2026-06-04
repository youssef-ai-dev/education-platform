import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mock Clerk ───────────────────────────────────────────────
const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  clerkMiddleware: (handler: Function) => async (request: any) => {
    // Simulate Clerk middleware wrapping
    return handler(mockAuth, request, {})
  },
  createRouteMatcher: (patterns: string[]) => {
    // Simple route matcher for test purposes
    return (request: { nextUrl: { pathname: string } }) => {
      const pathname = request.nextUrl.pathname
      return patterns.some(pattern => {
        const regex = new RegExp('^' + pattern.replace(/\(\\.\*\)/g, '.*').replace(/\(/g, '').replace(/\)/g, '') + '$')
        return regex.test(pathname) || pathname.startsWith(pattern.replace('(.*)', ''))
      })
    }
  },
}))

// ─── Mock NextResponse ────────────────────────────────────────
vi.mock('next/server', () => {
  const mockJson = (data: any, init?: { status?: number }) => ({
    status: init?.status || 200,
    headers: new Headers(),
    json: () => Promise.resolve(data),
  })
  const mockNext = () => ({
    status: 200,
    headers: new Headers(),
  })
  return {
    NextResponse: {
      json: mockJson,
      next: mockNext,
    },
  }
})

describe('Middleware - API Route Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Protected API Routes', () => {
    const protectedRoutes = [
      '/api/enrollments',
      '/api/enrollments/enr-123',
      '/api/quiz-attempts',
      '/api/certificates',
      '/api/certificates/cert-abc',
      '/api/generate-certificate',
    ]

    it('should block unauthenticated access to /api/enrollments', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      // Import middleware after mocks are set up
      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api/enrollments' },
      }

      const result = await middleware(request)
      expect(result.status).toBe(401)
    })

    it('should block unauthenticated access to /api/quiz-attempts', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api/quiz-attempts' },
      }

      const result = await middleware(request)
      expect(result.status).toBe(401)
    })

    it('should block unauthenticated access to /api/generate-certificate', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api/generate-certificate' },
      }

      const result = await middleware(request)
      expect(result.status).toBe(401)
    })

    it('should block unauthenticated access to /api/certificates', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api/certificates' },
      }

      const result = await middleware(request)
      expect(result.status).toBe(401)
    })

    it('should allow authenticated access to protected routes', async () => {
      mockAuth.mockResolvedValue({ userId: 'user-123' })

      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api/enrollments' },
      }

      const result = await middleware(request)
      // Should NOT be 401 — authenticated user should pass through
      expect(result.status).not.toBe(401)
    })
  })

  describe('Public API Routes', () => {
    it('should allow unauthenticated access to /api/courses', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api/courses' },
      }

      const result = await middleware(request)
      // Should NOT be 401 — courses are public
      expect(result.status).not.toBe(401)
    })

    it('should allow unauthenticated access to /api/courses/[id]', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api/courses/course-123' },
      }

      const result = await middleware(request)
      expect(result.status).not.toBe(401)
    })

    it('should allow access to /api health check', async () => {
      mockAuth.mockResolvedValue({ userId: null })

      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api' },
      }

      const result = await middleware(request)
      expect(result.status).not.toBe(401)
    })
  })

  describe('Seed Endpoint', () => {
    it('should allow unauthenticated access to /api/seed in development', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      mockAuth.mockResolvedValue({ userId: null })

      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api/seed' },
      }

      const result = await middleware(request)
      // In development, seed should be accessible
      expect(result.status).not.toBe(401)

      process.env.NODE_ENV = originalEnv
    })

    it('should require authentication for /api/seed in production', async () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      mockAuth.mockResolvedValue({ userId: null })

      // Clear module cache to re-evaluate env-dependent logic
      vi.resetModules()

      // Re-mock after reset
      vi.doMock('@clerk/nextjs/server', () => ({
        clerkMiddleware: (handler: Function) => async (request: any) => handler(mockAuth, request, {}),
        createRouteMatcher: (patterns: string[]) => (request: { nextUrl: { pathname: string } }) => {
          const pathname = request.nextUrl.pathname
          return patterns.some(pattern =>
            pathname.startsWith(pattern.replace('(.*)', ''))
          )
        },
      }))
      vi.doMock('next/server', () => ({
        NextResponse: {
          json: (data: any, init?: { status?: number }) => ({
            status: init?.status || 200,
            headers: new Headers(),
            json: () => Promise.resolve(data),
          }),
          next: () => ({ status: 200, headers: new Headers() }),
        },
      }))

      const middlewareModule = await import('@/proxy')
      const middleware = middlewareModule.default

      const request = {
        nextUrl: { pathname: '/api/seed' },
      }

      const result = await middleware(request)
      // In production, seed should require auth
      expect(result.status).toBe(401)

      process.env.NODE_ENV = originalEnv
    })
  })
})
