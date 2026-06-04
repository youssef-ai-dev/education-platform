import { NextRequest, NextResponse } from 'next/server'
import { getCertificates } from '@/lib/static-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 })
    }

    const certificates = await getCertificates(email)
    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Certificates GET error:', error)
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب الشهادات' }, { status: 500 })
  }
}
