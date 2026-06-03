'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export default function QuizResultView() {
  const { quizResult, selectedCourseId, navigate, studentEmail } = useAppStore()

  if (!quizResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">لا توجد نتيجة للاختبار</p>
      </div>
    )
  }

  const { score, total, passed } = quizResult
  const percentage = Math.round((score / total) * 100)
  const correct = score
  const incorrect = total - score

  // SVG Circle progress
  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full mx-4"
      >
        <Card className="overflow-hidden">
          {/* Header */}
          <div className={`p-8 text-center ${passed ? 'bg-gradient-to-bl from-emerald-500 to-emerald-700' : 'bg-gradient-to-bl from-red-500 to-red-700'}`}>
            {passed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
              </motion.div>
            )}
            {!passed && (
              <XCircle className="w-16 h-16 text-white/80 mx-auto mb-4" />
            )}
            <h2 className="text-2xl font-bold text-white mb-2">
              {passed ? 'مبروك! لقد نجحت' : 'لم تنجح هذه المرة'}
            </h2>
            <p className="text-white/80">
              {passed ? 'أحسنت! واصل تقدمك الرائع' : 'لا تقلق، يمكنك المحاولة مرة أخرى'}
            </p>
          </div>

          <CardContent className="p-8">
            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="80" cy="80" r="70"
                    stroke={passed ? '#059669' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">{percentage}%</span>
                  <span className="text-sm text-gray-500">النتيجة</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-emerald-700">{correct}</p>
                <p className="text-xs text-emerald-600">إجابة صحيحة</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-600">{incorrect}</p>
                <p className="text-xs text-red-500">إجابة خاطئة</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Award className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-gray-700">{total}</p>
                <p className="text-xs text-gray-500">إجمالي الأسئلة</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!passed && (
                <Button
                  variant="outline"
                  className="flex-1 border-emerald-600 text-emerald-600"
                  onClick={() => navigate('quiz', { quizId: '', courseId: selectedCourseId || '' })}
                >
                  <RotateCcw className="w-4 h-4 ml-1" />
                  حاول مرة أخرى
                </Button>
              )}
              {passed && (
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={async () => {
                    try {
                      const enrollRes = await fetch(`/api/enrollments?email=${encodeURIComponent(studentEmail)}`)
                      const enrollments = await enrollRes.json()
                      const enrollment = enrollments.find((e: { courseId: string }) => e.courseId === selectedCourseId)
                      if (enrollment) {
                        const certRes = await fetch('/api/generate-certificate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ enrollmentId: enrollment.id })
                        })
                        const cert = await certRes.json()
                        if (cert.certificateId) {
                          navigate('certificate', { certificateId: cert.certificateId })
                        }
                      }
                    } catch {
                      toast.error('حدث خطأ أثناء إنشاء الشهادة')
                    }
                  }}
                >
                  <Award className="w-4 h-4 ml-1" />
                  احصل على الشهادة
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('dashboard')}
              >
                <ArrowRight className="w-4 h-4 ml-1" />
                العودة للوحة التحكم
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
