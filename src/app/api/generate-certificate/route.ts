import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enrollmentId } = body

    if (!enrollmentId) {
      return NextResponse.json({ error: 'معرف التسجيل مطلوب' }, { status: 400 })
    }

    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true, certificate: true }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'التسجيل غير موجود' }, { status: 404 })
    }

    if (enrollment.certificate) {
      return NextResponse.json(enrollment.certificate)
    }

    // Update enrollment to completed
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: { progress: 100, completedAt: new Date() }
    })

    const certificate = await db.certificate.create({
      data: {
        enrollmentId,
        studentName: enrollment.studentName,
        courseTitle: enrollment.course.title,
        instructor: enrollment.course.instructor,
        certificateId: `CERT-${uuidv4().split('-')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
      }
    })

    return NextResponse.json(certificate, { status: 201 })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الشهادة' }, { status: 500 })
  }
}
