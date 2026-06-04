import { NextResponse } from 'next/server'

/**
 * Seed endpoint - ONLY available in development mode.
 * In production, this endpoint returns 403 Forbidden.
 */
export async function POST() {
  // Block in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'هذا المسار غير متاح في بيئة الإنتاج' },
      { status: 403 }
    )
  }

  try {
    // Dynamic import to avoid bundling seed logic in production
    const { execSync } = await import('child_process')
    execSync('npx tsx prisma/seed.ts', {
      cwd: process.cwd(),
      stdio: 'pipe',
    })

    const { db } = await import('@/lib/db')
    const courseCount = await db.course.count()

    return NextResponse.json({
      message: 'تم زرع البيانات التجريبية بنجاح',
      coursesCount: courseCount,
      seeded: true,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء عملية البذر' }, { status: 500 })
  }
}
