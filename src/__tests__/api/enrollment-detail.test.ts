import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mock Clerk auth ──────────────────────────────────────────
const mockAuth = vi.fn()
vi.mock('@clerk/nextjs/server', () => ({
  auth: mockAuth,
}))

// ─── Mock Prisma ──────────────────────────────────────────────
const mockEnrollmentFindUnique = vi.fn()
const mockEnrollmentUpdate = vi.fn()

vi.mock('@/lib/db', () => ({
  db: {
    enrollment: {
      findUnique: mockEnrollmentFindUnique,
      update: mockEnrollmentUpdate,
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

// ─── Enrollment [id] PATCH Route ──────────────────────────────
describe('Enrollment [id] PATCH - Security & Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue({ userId: 'user-123' })
  })

  it('rejects unauthenticated PATCH requests with 401', async () => {
    mockAuth.mockResolvedValue({ userId: null })

    const { PATCH } = await import('@/app/api/enrollments/[id]/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/enrollments/enr-1'), {
      method: 'PATCH',
      body: JSON.stringify({ progress: 50 }),
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'enr-1' }) })
    expect(response.status).toBe(401)
    const data = await response.json()
    expect(data.error).toBeDefined()
  })

  it('rejects if user does not own the enrollment (403)', async () => {
    // Enrollment belongs to a different user
    mockEnrollmentFindUnique.mockResolvedValue({ userId: 'user-456' })

    const { PATCH } = await import('@/app/api/enrollments/[id]/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/enrollments/enr-1'), {
      method: 'PATCH',
      body: JSON.stringify({ progress: 50 }),
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'enr-1' }) })
    expect(response.status).toBe(403)
  })

  it('validates progress range with Zod (rejects progress > 100)', async () => {
    // Ownership check passes
    mockEnrollmentFindUnique.mockResolvedValueOnce({ userId: 'user-123' })

    const { PATCH } = await import('@/app/api/enrollments/[id]/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/enrollments/enr-1'), {
      method: 'PATCH',
      body: JSON.stringify({ progress: 150 }), // Invalid!
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'enr-1' }) })
    expect(response.status).toBe(400)
  })

  it('validates progress range with Zod (rejects negative progress)', async () => {
    // Ownership check passes
    mockEnrollmentFindUnique.mockResolvedValueOnce({ userId: 'user-123' })

    const { PATCH } = await import('@/app/api/enrollments/[id]/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/enrollments/enr-1'), {
      method: 'PATCH',
      body: JSON.stringify({ progress: -5 }), // Invalid!
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'enr-1' }) })
    expect(response.status).toBe(400)
  })

  it('successfully updates progress for authorized user', async () => {
    // Ownership check passes
    mockEnrollmentFindUnique
      .mockResolvedValueOnce({ userId: 'user-123' }) // ownership check
      .mockResolvedValueOnce({ // enrollment fetch
        id: 'enr-1',
        userId: 'user-123',
        progress: 0,
        completedAt: null,
        enrolledAt: new Date(),
      })
    mockEnrollmentUpdate.mockResolvedValue({
      id: 'enr-1',
      userId: 'user-123',
      studentName: 'Test',
      studentEmail: 'test@test.com',
      courseId: 'course-1',
      progress: 75,
      enrolledAt: new Date(),
      completedAt: null,
    })

    const { PATCH } = await import('@/app/api/enrollments/[id]/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/enrollments/enr-1'), {
      method: 'PATCH',
      body: JSON.stringify({ progress: 75 }),
    })

    const response = await PATCH(request, { params: Promise.resolve({ id: 'enr-1' }) })
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.progress).toBe(75)
  })
})
