import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Prisma client before importing the route handlers
const mockCourseFindMany = vi.fn()
const mockEnrollmentCount = vi.fn()
const mockEnrollmentGroupBy = vi.fn().mockResolvedValue([])

vi.mock('@/lib/db', () => ({
  db: {
    course: {
      findMany: mockCourseFindMany,
      findUnique: vi.fn(),
      count: vi.fn(),
    },
    enrollment: {
      count: mockEnrollmentCount,
      groupBy: mockEnrollmentGroupBy,
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

// Mock NextRequest/NextResponse
import { NextRequest } from 'next/server'

const mockCourseData = [
  {
    id: 'course-web-dev',
    title: 'أساسيات تطوير الويب',
    description: 'تعلم أساسيات تصميم وتطوير صفحات الويب',
    category: 'برمجة',
    thumbnailUrl: '/thumbnails/web-dev.png',
    instructor: 'أحمد محمد الخالدي',
    duration: '24 ساعة',
    rating: 4.8,
    price: 199,
    level: 'مبتدئ',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    lessons: [
      { id: 'l-wd-1', title: 'مقدمة', description: 'نظرة عامة', videoUrl: '', duration: '45 دقيقة', order: 1, courseId: 'course-web-dev', isFree: true },
    ],
    quizzes: [
      {
        id: 'quiz-wd',
        title: 'اختبار',
        courseId: 'course-web-dev',
        lessonId: null,
        timeLimit: 15,
        passingScore: 60,
        questions: [
          { id: 'q-wd-1', quizId: 'quiz-wd', question: 'سؤال؟', options: '["أ","ب","ج","د"]', correctAnswer: 0, explanation: 'شرح' },
        ],
      },
    ],
    enrollments: [],
  },
]

describe('Courses API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockEnrollmentCount.mockResolvedValue(0)
    mockEnrollmentGroupBy.mockResolvedValue([])
  })

  it('GET /api/courses returns all courses', async () => {
    mockCourseFindMany.mockResolvedValue(mockCourseData)

    const { GET } = await import('@/app/api/courses/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/courses'))
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveLength(1)
    expect(data[0].id).toBe('course-web-dev')
    expect(data[0].title).toBe('أساسيات تطوير الويب')
  })

  it('GET /api/courses with category filter', async () => {
    mockCourseFindMany.mockResolvedValue(mockCourseData)

    const { GET } = await import('@/app/api/courses/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/courses?category=برمجة'))
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(mockCourseFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category: 'برمجة' }),
      })
    )
  })

  it('GET /api/courses with search filter', async () => {
    mockCourseFindMany.mockResolvedValue(mockCourseData)

    const { GET } = await import('@/app/api/courses/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/courses?search=ويب'))
    const response = await GET(request)

    expect(response.status).toBe(200)
    expect(mockCourseFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { title: { contains: 'ويب' } },
          ]),
        }),
      })
    )
  })

  it('GET /api/courses handles errors gracefully', async () => {
    mockCourseFindMany.mockRejectedValue(new Error('DB error'))

    const { GET } = await import('@/app/api/courses/route')

    const request = new NextRequest(new URL('http://localhost:3000/api/courses'))
    const response = await GET(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBeDefined()
  })
})
