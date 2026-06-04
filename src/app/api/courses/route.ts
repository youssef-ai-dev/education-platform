import { NextRequest, NextResponse } from 'next/server'
import { getCourses } from '@/lib/static-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const courses = await getCourses(category, search)
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Courses GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الدورات' }, { status: 500 })
  }
}
