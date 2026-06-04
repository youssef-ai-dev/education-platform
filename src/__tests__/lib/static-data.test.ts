import { describe, it, expect, vi, beforeEach } from 'vitest'

// Use vi.hoisted to create mock functions that can be used in vi.mock factories
const { mockCourseFindMany, mockCourseFindUnique, mockEnrollmentCount } = vi.hoisted(() => ({
  mockCourseFindMany: vi.fn(),
  mockCourseFindUnique: vi.fn(),
  mockEnrollmentCount: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    course: {
      findMany: mockCourseFindMany,
      findUnique: mockCourseFindUnique,
    },
    enrollment: {
      count: mockEnrollmentCount,
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    quizAttempt: {
      create: vi.fn(),
    },
    certificate: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// Import after mocking
import { getCourses, getCourseById, BASE_ENROLLMENT_COUNTS } from '@/lib/static-data'

const mockCourseData = [
  {
    id: 'course-web-dev',
    title: 'أساسيات تطوير الويب باستخدام HTML و CSS',
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
      { id: 'l-wd-1', title: 'مقدمة في تطوير الويب', description: 'نظرة عامة', videoUrl: '', duration: '45 دقيقة', order: 1, courseId: 'course-web-dev', isFree: true },
      { id: 'l-wd-2', title: 'أساسيات HTML5', description: 'تعلم بنية صفحات HTML', videoUrl: '', duration: '3 ساعات', order: 2, courseId: 'course-web-dev', isFree: true },
    ],
    quizzes: [
      {
        id: 'quiz-wd',
        title: 'اختبار أساسيات تطوير الويب',
        courseId: 'course-web-dev',
        lessonId: null,
        timeLimit: 15,
        passingScore: 60,
        questions: [
          { id: 'q-wd-1', quizId: 'quiz-wd', question: 'ما هو العنصر المستخدم لإنشاء عنوان رئيسي في HTML؟', options: '["<heading>","<h1>","<title>","<header>"]', correctAnswer: 1, explanation: 'يُستخدم عنصر <h1> لإنشاء العنوان الرئيسي في صفحة HTML' },
        ],
      },
    ],
    enrollments: [],
  },
  {
    id: 'course-react',
    title: 'تطوير تطبيقات React الاحترافية',
    description: 'دورة شاملة لتعلم مكتبة React',
    category: 'برمجة',
    thumbnailUrl: '/thumbnails/react.png',
    instructor: 'سارة عبدالله المنصوري',
    duration: '36 ساعة',
    rating: 4.9,
    price: 299,
    level: 'متوسط',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    lessons: [
      { id: 'l-r-1', title: 'مقدمة في React', description: 'فهم مفهوم المكتبة', videoUrl: '', duration: '1 ساعة', order: 1, courseId: 'course-react', isFree: true },
    ],
    quizzes: [],
    enrollments: [],
  },
  {
    id: 'course-figma',
    title: 'تصميم واجهات المستخدم باستخدام Figma',
    description: 'تعلم تصميم واجهات مستخدم احترافية',
    category: 'تصميم',
    thumbnailUrl: '/thumbnails/figma.png',
    instructor: 'نورة حسن الشمري',
    duration: '20 ساعة',
    rating: 4.7,
    price: 179,
    level: 'مبتدئ',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
    lessons: [],
    quizzes: [],
    enrollments: [],
  },
]

describe('static-data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default: return 0 for enrollment counts
    mockEnrollmentCount.mockResolvedValue(0)
  })

  describe('getCourses', () => {
    it('returns all courses when no filters are provided', async () => {
      mockCourseFindMany.mockResolvedValue(mockCourseData)

      const courses = await getCourses()

      expect(courses).toHaveLength(3)
      expect(courses[0].id).toBe('course-web-dev')
      expect(courses[1].id).toBe('course-react')
      expect(courses[2].id).toBe('course-figma')
      expect(mockCourseFindMany).toHaveBeenCalledWith({
        where: {},
        include: {
          lessons: { orderBy: { order: 'asc' } },
          quizzes: { include: { questions: true } },
          enrollments: true,
        },
        orderBy: { createdAt: 'asc' },
      })
    })

    it('filters by category when provided', async () => {
      mockCourseFindMany.mockResolvedValue(mockCourseData.filter(c => c.category === 'برمجة'))

      const courses = await getCourses('برمجة')

      expect(mockCourseFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'برمجة' }),
        })
      )
    })

    it('does not filter when category is "الكل"', async () => {
      mockCourseFindMany.mockResolvedValue(mockCourseData)

      await getCourses('الكل')

      expect(mockCourseFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      )
    })

    it('filters by search term', async () => {
      mockCourseFindMany.mockResolvedValue(mockCourseData.filter(c =>
        c.title.toLowerCase().includes('react')
      ))

      const courses = await getCourses(undefined, 'react')

      expect(mockCourseFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: 'react' } },
              { description: { contains: 'react' } },
              { instructor: { contains: 'react' } },
            ],
          }),
        })
      )
    })

    it('includes studentsCount from base enrollment counts', async () => {
      mockCourseFindMany.mockResolvedValue(mockCourseData)

      const courses = await getCourses()

      // The web-dev course has a base count of 1250
      expect(courses[0].studentsCount).toBe(1250)
      // The react course has a base count of 2100
      expect(courses[1].studentsCount).toBe(2100)
    })

    it('adds DB enrollments to base count', async () => {
      mockCourseFindMany.mockResolvedValue(mockCourseData)
      mockEnrollmentCount.mockResolvedValue(5)

      const courses = await getCourses()

      // Base 1250 + 5 from DB
      expect(courses[0].studentsCount).toBe(1255)
    })
  })

  describe('getCourseById', () => {
    it('returns the correct course by id', async () => {
      mockCourseFindUnique.mockResolvedValue(mockCourseData[0])

      const course = await getCourseById('course-web-dev')

      expect(course).toBeDefined()
      expect(course?.id).toBe('course-web-dev')
      expect(course?.title).toBe('أساسيات تطوير الويب باستخدام HTML و CSS')
      expect(course?.lessons).toHaveLength(2)
      expect(course?.quizzes).toHaveLength(1)
      expect(mockCourseFindUnique).toHaveBeenCalledWith({
        where: { id: 'course-web-dev' },
        include: {
          lessons: { orderBy: { order: 'asc' } },
          quizzes: { include: { questions: true } },
          enrollments: true,
        },
      })
    })

    it('returns undefined for an invalid id', async () => {
      mockCourseFindUnique.mockResolvedValue(null)

      const course = await getCourseById('non-existent-id')

      expect(course).toBeUndefined()
    })
  })

  describe('BASE_ENROLLMENT_COUNTS', () => {
    it('has counts for all 6 courses', () => {
      expect(Object.keys(BASE_ENROLLMENT_COUNTS)).toHaveLength(6)
      expect(BASE_ENROLLMENT_COUNTS['course-web-dev']).toBe(1250)
      expect(BASE_ENROLLMENT_COUNTS['course-react']).toBe(2100)
      expect(BASE_ENROLLMENT_COUNTS['course-figma']).toBe(890)
      expect(BASE_ENROLLMENT_COUNTS['course-agile']).toBe(670)
      expect(BASE_ENROLLMENT_COUNTS['course-english']).toBe(1580)
      expect(BASE_ENROLLMENT_COUNTS['course-data']).toBe(980)
    })
  })
})
