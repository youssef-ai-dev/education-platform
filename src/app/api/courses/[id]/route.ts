import { NextRequest, NextResponse } from 'next/server'
import { getCourseById } from '@/lib/static-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const course = getCourseById(id)

    if (!course) {
      return NextResponse.json({ error: 'الدورة غير موجودة' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Course GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الدورة' }, { status: 500 })
  }
}
