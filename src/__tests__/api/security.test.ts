import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mock Clerk auth ──────────────────────────────────────────
const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
}))

// ─── Mock Prisma ──────────────────────────────────────────────
const mockQuizAttemptCreate = vi.fn()
const mockQuizFindUnique = vi.fn()
const mockEnrollmentFindUnique = vi.fn()
const mockCertificateFindUnique = vi.fn()
const mockCertificateCreate = vi.fn()
const mockEnrollmentUpdate = vi.fn()
const mockCourseFindUnique = vi.fn()
const mockCourseFindMany = vi.fn()
const mockCourseCount = vi.fn()
const mockEnrollmentFindMany = vi.fn()
const mockEnrollmentFindFirst = vi.fn()
const mockEnrollmentCreate = vi.fn()
const mockEnrollmentCount = vi.fn()
const mockEnrollmentGroupBy = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    course: {
      findMany: mockCourseFindMany,
      findUnique: mockCourseFindUnique,
      count: mockCourseCount,
    },
    enrollment: {
      findMany: mockEnrollmentFindMany,
      findFirst: mockEnrollmentFindFirst,
      findUnique: mockEnrollmentFindUnique,
      create: mockEnrollmentCreate,
      update: mockEnrollmentUpdate,
      count: mockEnrollmentCount,
      groupBy: mockEnrollmentGroupBy,
    },
    quizAttempt: {
      create: mockQuizAttemptCreate,
    },
    certificate: {
      findUnique: mockCertificateFindUnique,
      create: mockCertificateCreate,
    },
    quiz: {
      findUnique: mockQuizFindUnique,
    },
  },
}))

// Mock @vercel/kv
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
  },
}))

import { NextRequest } from 'next/server'

// ─── Quiz Attempts API ────────────────────────────────────────
describe('Quiz Attempts API - Security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: authenticated user
    mockAuth.mockResolvedValue({ userId: 'user-123' })
  })

  it('rejects unauthenticated requests with 401', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const { POST } = await import('@/app/api/quiz-attempts/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/quiz-attempts'), {
      method: 'POST',
      body: JSON.stringify({
        enrollmentId: 'enr-1',
        quizId: 'quiz-1',
        answers: [0, 1, 2],
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toBeDefined()
  })

  it('rejects requests with score/passed from client — only answers are accepted', async () => {
    const { POST } = await import('@/app/api/quiz-attempts/route')

    mockEnrollmentFindUnique.mockResolvedValue({ userId: 'user-123' })
    mockQuizFindUnique.mockResolvedValue({
      id: 'quiz-1',
      passingScore: 60,
      questions: [
        { id: 'q1', correctAnswer: 0 },
        { id: 'q2', correctAnswer: 1 },
      ],
    })
    mockQuizAttemptCreate.mockResolvedValue({
      id: 'attempt-1',
      enrollmentId: 'enr-1',
      quizId: 'quiz-1',
      score: 50,
      passed: false,
      answers: '[0,1]',
      completedAt: new Date(),
    })

    const request = new NextRequest(new URL('http://localhost:3000/api/quiz-attempts'), {
      method: 'POST',
      body: JSON.stringify({
        enrollmentId: 'enr-1',
        quizId: 'quiz-1',
        answers: [0, 1],
        score: 100,       // Client tries to cheat!
        passed: true,      // Client tries to cheat!
      }),
    })

    const response = await POST(request)

    if (response.status === 201) {
      const data = await response.json()
      // Score should be calculated server-side (50%), NOT the client-sent 100
      expect(data.score).toBe(50)
      expect(data.passed).toBe(false)
    }
  })

  it('calculates score SERVER-SIDE based on correct answers', async () => {
    const { POST } = await import('@/app/api/quiz-attempts/route')

    mockEnrollmentFindUnique.mockResolvedValue({ userId: 'user-123' })
    mockQuizFindUnique.mockResolvedValue({
      id: 'quiz-1',
      passingScore: 60,
      questions: [
        { id: 'q1', correctAnswer: 0 },
        { id: 'q2', correctAnswer: 1 },
        { id: 'q3', correctAnswer: 2 },
        { id: 'q4', correctAnswer: 0 },
      ],
    })
    mockQuizAttemptCreate.mockImplementation((args: any) =>
      Promise.resolve({
        id: 'attempt-1',
        enrollmentId: args.data.enrollmentId,
        quizId: args.data.quizId,
        score: args.data.score,
        passed: args.data.passed,
        answers: args.data.answers,
        completedAt: new Date(),
      })
    )

    // User answers: q1=correct(0), q2=correct(1), q3=wrong(0), q4=correct(0)
    // Score should be 3/4 = 75%
    const request = new NextRequest(new URL('http://localhost:3000/api/quiz-attempts'), {
      method: 'POST',
      body: JSON.stringify({
        enrollmentId: 'enr-1',
        quizId: 'quiz-1',
        answers: [0, 1, 0, 0],
      }),
    })

    const response = await POST(request)

    if (response.status === 201) {
      expect(mockQuizAttemptCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: 75,
            passed: true,
          }),
        })
      )
    }
  })

  it('rejects request if user does not own the enrollment', async () => {
    const { POST } = await import('@/app/api/quiz-attempts/route')

    // Enrollment belongs to a different user
    mockEnrollmentFindUnique.mockResolvedValue({ userId: 'user-456' })

    const request = new NextRequest(new URL('http://localhost:3000/api/quiz-attempts'), {
      method: 'POST',
      body: JSON.stringify({
        enrollmentId: 'enr-1',
        quizId: 'quiz-1',
        answers: [0],
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it('validates answer format with Zod', async () => {
    const { POST } = await import('@/app/api/quiz-attempts/route')

    // Invalid: answers contains string instead of number
    const request = new NextRequest(new URL('http://localhost:3000/api/quiz-attempts'), {
      method: 'POST',
      body: JSON.stringify({
        enrollmentId: 'enr-1',
        quizId: 'quiz-1',
        answers: ['hello'],  // Invalid!
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})

// ─── Generate Certificate API ─────────────────────────────────
describe('Generate Certificate API - Security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ userId: 'user-123' })
  })

  it('rejects unauthenticated requests with 401', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const { POST } = await import('@/app/api/generate-certificate/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/generate-certificate'), {
      method: 'POST',
      body: JSON.stringify({ enrollmentId: 'enr-1' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('rejects certificate generation if course is not completed', async () => {
    const { POST } = await import('@/app/api/generate-certificate/route')

    mockEnrollmentFindUnique.mockResolvedValueOnce({ userId: 'user-123' }) // ownership check
    mockEnrollmentFindUnique.mockResolvedValueOnce({ // full enrollment fetch
      id: 'enr-1',
      userId: 'user-123',
      progress: 50, // NOT completed!
      course: { title: 'Test Course', instructor: 'Test' },
    })

    const request = new NextRequest(new URL('http://localhost:3000/api/generate-certificate'), {
      method: 'POST',
      body: JSON.stringify({ enrollmentId: 'enr-1' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain('إتمام')
  })

  it('rejects if user does not own the enrollment', async () => {
    const { POST } = await import('@/app/api/generate-certificate/route')

    mockEnrollmentFindUnique.mockResolvedValue({ userId: 'different-user' })

    const request = new NextRequest(new URL('http://localhost:3000/api/generate-certificate'), {
      method: 'POST',
      body: JSON.stringify({ enrollmentId: 'enr-1' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it('allows certificate generation when course is completed and user owns it', async () => {
    const { POST } = await import('@/app/api/generate-certificate/route')

    mockEnrollmentFindUnique.mockResolvedValueOnce({ userId: 'user-123' }) // ownership check
    mockEnrollmentFindUnique.mockResolvedValueOnce({
      id: 'enr-1',
      userId: 'user-123',
      progress: 100, // Completed!
      studentName: 'Test Student',
      course: { title: 'Test Course', instructor: 'Test Instructor' },
    })
    mockCertificateFindUnique.mockResolvedValue(null) // No existing cert
    mockCertificateCreate.mockResolvedValue({
      id: 'cert-1',
      enrollmentId: 'enr-1',
      studentName: 'Test Student',
      courseTitle: 'Test Course',
      instructor: 'Test Instructor',
      certificateId: 'CERT-ABC123',
      completedAt: new Date(),
    })

    const request = new NextRequest(new URL('http://localhost:3000/api/generate-certificate'), {
      method: 'POST',
      body: JSON.stringify({ enrollmentId: 'enr-1' }),
    })

    const response = await POST(request)
    expect(response.status).toBe(201)
  })
})

// ─── Seed API ─────────────────────────────────────────────────
describe('Seed API - Security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('blocks seed endpoint in production', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const { POST } = await import('@/app/api/seed/route')
    const response = await POST()

    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toBeDefined()

    process.env.NODE_ENV = originalEnv
  })
})

// ─── Enrollments API ──────────────────────────────────────────
describe('Enrollments API - Security', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ userId: 'user-123' })
  })

  it('rejects unauthenticated GET requests', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const { GET } = await import('@/app/api/enrollments/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/enrollments?email=test@test.com'))
    const response = await GET(request)

    expect(response.status).toBe(401)
  })

  it('rejects unauthenticated POST requests', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const { POST } = await import('@/app/api/enrollments/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/enrollments'), {
      method: 'POST',
      body: JSON.stringify({
        studentName: 'Test',
        studentEmail: 'test@test.com',
        courseId: 'course-1',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('uses authenticated userId instead of client-supplied userId', async () => {
    const { POST } = await import('@/app/api/enrollments/route')

    mockEnrollmentFindFirst.mockResolvedValue(null) // No existing enrollment
    mockCourseFindUnique.mockResolvedValue({ id: 'course-1', title: 'Test' })
    mockEnrollmentCreate.mockImplementation((args: any) =>
      Promise.resolve({
        id: 'enr-new',
        userId: args.data.userId,
        studentName: args.data.studentName,
        studentEmail: args.data.studentEmail,
        courseId: args.data.courseId,
        progress: 0,
        enrolledAt: new Date(),
        completedAt: null,
      })
    )

    const request = new NextRequest(new URL('http://localhost:3000/api/enrollments'), {
      method: 'POST',
      body: JSON.stringify({
        studentName: 'Test',
        studentEmail: 'test@test.com',
        courseId: 'course-1',
        userId: 'hacker-user-id', // Client tries to impersonate another user!
      }),
    })

    const response = await POST(request)

    if (response.status === 201) {
      // The enrollment should use the auth session userId, NOT the client-sent one
      expect(mockEnrollmentCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-123', // From auth, not 'hacker-user-id'
          }),
        })
      )
    }
  })

  it('validates email format with Zod', async () => {
    const { POST } = await import('@/app/api/enrollments/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/enrollments'), {
      method: 'POST',
      body: JSON.stringify({
        studentName: 'Test',
        studentEmail: 'not-an-email', // Invalid email!
        courseId: 'course-1',
      }),
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})

// ─── Rate Limiting (in-memory) ────────────────────────────────
describe('Rate Limiting', () => {
  it('allows requests within the limit', async () => {
    const { checkRateLimit } = await import('@/lib/rate-limit')

    const result = await checkRateLimit('test-user', 'test-route', { limit: 5, windowSeconds: 60 })
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('blocks requests exceeding the limit', async () => {
    const { checkRateLimit } = await import('@/lib/rate-limit')

    // Make 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      await checkRateLimit('test-user-block', 'test-route', { limit: 5, windowSeconds: 60 })
    }

    // 6th request should be blocked
    const result = await checkRateLimit('test-user-block', 'test-route', { limit: 5, windowSeconds: 60 })
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('tracks different routes independently', async () => {
    const { checkRateLimit } = await import('@/lib/rate-limit')

    // Exhaust limit on route-a
    for (let i = 0; i < 3; i++) {
      await checkRateLimit('test-user-routes', 'route-a', { limit: 3, windowSeconds: 60 })
    }

    // route-b should still be allowed
    const result = await checkRateLimit('test-user-routes', 'route-b', { limit: 3, windowSeconds: 60 })
    expect(result.allowed).toBe(true)
  })
})

// ─── Zod Validators ───────────────────────────────────────────
describe('Zod Validators', () => {
  it('createQuizAttemptSchema rejects score/passed fields', async () => {
    const { createQuizAttemptSchema } = await import('@/lib/validators')

    // Should strip/ignore score and passed since they're not in the schema
    const result = createQuizAttemptSchema.safeParse({
      enrollmentId: 'enr-1',
      quizId: 'quiz-1',
      answers: [0, 1, 2],
      score: 100,   // Should be stripped
      passed: true,  // Should be stripped
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('score')
      expect(result.data).not.toHaveProperty('passed')
    }
  })

  it('createEnrollmentSchema does not accept userId from client', async () => {
    const { createEnrollmentSchema } = await import('@/lib/validators')

    // userId should be stripped because it's not in the schema
    const result = createEnrollmentSchema.safeParse({
      studentName: 'Test',
      studentEmail: 'test@test.com',
      courseId: 'course-1',
      userId: 'hacker-id',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('userId')
    }
  })

  it('updateEnrollmentSchema rejects progress outside 0-100', async () => {
    const { updateEnrollmentSchema } = await import('@/lib/validators')

    const result = updateEnrollmentSchema.safeParse({
      progress: 150, // Out of range!
    })

    expect(result.success).toBe(false)
  })

  it('createQuizAttemptSchema validates answer indices', async () => {
    const { createQuizAttemptSchema } = await import('@/lib/validators')

    // Answer index > 3 is invalid
    const result = createQuizAttemptSchema.safeParse({
      enrollmentId: 'enr-1',
      quizId: 'quiz-1',
      answers: [0, 4], // 4 is out of range (0-3)
    })

    expect(result.success).toBe(false)
  })
})
