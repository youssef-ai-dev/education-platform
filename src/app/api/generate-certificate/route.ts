import { NextRequest, NextResponse } from 'next/server'
import { generateCertificate } from '@/lib/static-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enrollmentId } = body

    if (!enrollmentId) {
      return NextResponse.json({ error: 'معرف التسجيل مطلوب' }, { status: 400 })
    }

    const result = generateCertificate(enrollmentId)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }

    return NextResponse.json(result.certificate, { status: 201 })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء إنشاء الشهادة' }, { status: 500 })
  }
}
