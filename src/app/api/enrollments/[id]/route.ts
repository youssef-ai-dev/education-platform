import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { progress } = body

    if (progress === undefined) {
      return NextResponse.json({ error: 'نسبة التقدم مطلوبة' }, { status: 400 })
    }

    const enrollment = await db.enrollment.update({
      where: { id },
      data: {
        progress,
        completedAt: progress >= 100 ? new Date() : undefined
      }
    })

    return NextResponse.json(enrollment)
  } catch (error) {
    console.error('Enrollment PATCH error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث التقدم' }, { status: 500 })
  }
}
