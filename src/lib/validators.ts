import { z } from 'zod'

// ─── Course Validators ────────────────────────────────────────
export const getCoursesQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().max(200).optional(),
})

export const getCourseByIdSchema = z.object({
  id: z.string().min(1).max(100),
})

// ─── Enrollment Validators ────────────────────────────────────
export const getEnrollmentsQuerySchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
})

// userId is NOT accepted from the client — it comes from the Clerk auth session
export const createEnrollmentSchema = z.object({
  studentName: z.string().min(1, 'اسم الطالب مطلوب').max(200),
  studentEmail: z.string().email('بريد إلكتروني غير صالح'),
  courseId: z.string().min(1, 'معرف الدورة مطلوب'),
})

export const updateEnrollmentSchema = z.object({
  progress: z.number().min(0).max(100, 'نسبة التقدم يجب أن تكون بين 0 و 100'),
})

export const enrollmentIdSchema = z.object({
  id: z.string().min(1),
})

// ─── Quiz Attempt Validators ──────────────────────────────────
// NOTE: score and passed are NOT accepted from the client — they are calculated server-side
export const createQuizAttemptSchema = z.object({
  enrollmentId: z.string().min(1, 'معرف التسجيل مطلوب'),
  quizId: z.string().min(1, 'معرف الاختبار مطلوب'),
  answers: z.array(z.number().min(0).max(3)).min(1, 'يجب الإجابة على سؤال واحد على الأقل'),
})

// ─── Certificate Validators ───────────────────────────────────
export const generateCertificateSchema = z.object({
  enrollmentId: z.string().min(1, 'معرف التسجيل مطلوب'),
})

export const getCertificatesQuerySchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
})

export const certificateIdSchema = z.object({
  certificateId: z.string().min(1),
})

// ─── Validation Helper ────────────────────────────────────────
import { NextResponse } from 'next/server'

export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true
  data: T
} | {
  success: false
  error: NextResponse
} {
  const result = schema.safeParse(data)
  if (!result.success) {
    // Zod 4 uses `issues`, Zod 3 uses `errors` — support both
    const issues = (result.error as any).issues ?? (result.error as any).errors ?? []
    const messages = issues.map((e: any) => e.message).join(', ')
    return {
      success: false,
      error: NextResponse.json(
        { error: messages || 'بيانات غير صالحة' },
        { status: 400 }
      ),
    }
  }
  return { success: true, data: result.data }
}

export function validateQuery<T>(schema: z.ZodSchema<T>, data: Record<string, string | string[] | undefined>): {
  success: true
  data: T
} | {
  success: false
  error: NextResponse
} {
  const result = schema.safeParse(data)
  if (!result.success) {
    const issues = (result.error as any).issues ?? (result.error as any).errors ?? []
    const messages = issues.map((e: any) => e.message).join(', ')
    return {
      success: false,
      error: NextResponse.json(
        { error: messages || 'بيانات غير صالحة' },
        { status: 400 }
      ),
    }
  }
  return { success: true, data: result.data }
}
