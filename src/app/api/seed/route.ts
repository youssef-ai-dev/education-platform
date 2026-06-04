import { NextResponse } from 'next/server'
import { seedData } from '@/lib/static-data'

export async function POST() {
  try {
    const result = seedData()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء عملية البذر' }, { status: 500 })
  }
}
