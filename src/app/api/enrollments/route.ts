import { NextRequest, NextResponse } from 'next/server'
import { getEnrollments, getEnrollmentsByUserId, createEnrollment } from '@/lib/static-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    if (userId) {
      const enrollments = getEnrollmentsByUserId(userId)
      return NextResponse.json(enrollments)
    }

    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني أو معرف المستخدم مطلوب' }, { status: 400 })
    }

    const enrollments = getEnrollments(email)
    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Enrollments GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب التسجيلات' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, studentName, studentEmail, courseId } = body

    if (!studentName || !studentEmail || !courseId) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 })
    }

    const result = createEnrollment({ userId, studentName, studentEmail, courseId })

    if (result.error) {
      return NextResponse.json({ error: result.error, enrollment: result.enrollment }, { status: 409 })
    }

    return NextResponse.json(result.enrollment, { status: 201 })
  } catch (error) {
    console.error('Enrollment POST error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء التسجيل' }, { status: 500 })
  }
}
