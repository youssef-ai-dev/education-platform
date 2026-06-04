import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { validateBody, generateCertificateSchema } from '@/lib/validators'
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/lib/rate-limit'
import { verifyEnrollmentOwnership } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // 1. Require authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 })
    }

    // 2. Rate limiting
    const identifier = getRateLimitIdentifier(request, userId)
    const rateLimit = checkRateLimit(identifier, 'generate-certificate', RATE_LIMITS.generateCertificate)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `طلبات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(rateLimit.resetIn / 1000)} ثانية` },
        { status: 429 }
      )
    }

    // 3. Validate input
    const body = await request.json()
    const validation = validateBody(generateCertificateSchema, body)
    if (!validation.success) return validation.error

    const { enrollmentId } = validation.data

    // 4. Verify the user owns this enrollment
    const ownership = await verifyEnrollmentOwnership(userId, enrollmentId)
    if (!ownership.authorized) return ownership.error!

    // 5. Fetch enrollment with course details
    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { course: true },
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'التسجيل غير موجود' }, { status: 404 })
    }

    // 6. Verify the student has actually completed the course
    if (enrollment.progress < 100) {
      return NextResponse.json(
        { error: 'يجب إتمام الدورة بالكامل قبل طلب الشهادة' },
        { status: 400 }
      )
    }

    // 7. Check if certificate already exists
    const existingCert = await db.certificate.findUnique({
      where: { enrollmentId },
    })

    if (existingCert) {
      return NextResponse.json({
        certificate: {
          ...existingCert,
          completedAt: existingCert.completedAt.toISOString(),
        },
      })
    }

    // 8. Generate the certificate
    const cert = await db.certificate.create({
      data: {
        enrollmentId,
        studentName: enrollment.studentName,
        courseTitle: enrollment.course?.title || '',
        instructor: enrollment.course?.instructor || '',
        certificateId: `CERT-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      },
    })

    return NextResponse.json({
      certificate: {
        ...cert,
        completedAt: cert.completedAt.toISOString(),
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الشهادة' }, { status: 500 })
  }
}
