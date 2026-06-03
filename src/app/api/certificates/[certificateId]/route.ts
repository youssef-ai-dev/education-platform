import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params
    const certificate = await db.certificate.findUnique({
      where: { certificateId }
    })

    if (!certificate) {
      return NextResponse.json({ error: 'الشهادة غير موجودة' }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Certificate GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الشهادة' }, { status: 500 })
  }
}
