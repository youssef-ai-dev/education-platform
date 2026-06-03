'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Award, RotateCcw, ArrowRight, Trophy, Star } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function QuizResultView() {
  const { quizResult, selectedCourseId, navigate, studentEmail } = useAppStore()

  useEffect(() => {
    if (quizResult?.passed) {
      // Fire confetti when quiz is passed!
      const duration = 3000
      const end = Date.now() + duration

      const colors = ['#059669', '#10b981', '#f59e0b', '#6366f1', '#ec4899']

      ;(function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      })()
    }
  }, [quizResult?.passed])

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

  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full mx-4"
      >
        <Card className="overflow-hidden border-0 shadow-2xl">
          {/* Header */}
          <div className={`p-8 text-center relative overflow-hidden ${passed ? 'bg-gradient-to-bl from-emerald-500 to-emerald-700' : 'bg-gradient-to-bl from-red-500 to-red-700'}`}>
            {/* Decorative elements for passed state */}
            {passed && (
              <>
                <div className="absolute top-2 right-4 opacity-20"><Star className="w-8 h-8 text-white" /></div>
                <div className="absolute bottom-4 left-6 opacity-15"><Star className="w-6 h-6 text-white" /></div>
                <div className="absolute top-6 left-10 opacity-10"><Star className="w-10 h-10 text-white" /></div>
              </>
            )}
            {passed ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <Trophy className="w-20 h-20 text-amber-300 mx-auto mb-4 drop-shadow-lg" />
              </motion.div>
            ) : (
              <XCircle className="w-16 h-16 text-white/80 mx-auto mb-4" />
            )}
            <h2 className="text-2xl font-bold text-white mb-2">
              {passed ? 'مبروك! لقد نجحت! 🎉' : 'لم تنجح هذه المرة'}
            </h2>
            <p className="text-white/80 text-lg">
              {passed ? 'أحسنت! واصل تقدمك الرائع' : 'لا تقلق، يمكنك المحاولة مرة أخرى'}
            </p>
          </div>

          <CardContent className="p-8">
            {/* Score Circle */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                  <motion.circle
                    cx="80" cy="80" r="70"
                    stroke={passed ? '#059669' : '#ef4444'}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl font-extrabold text-gray-900"
                  >
                    {percentage}%
                  </motion.span>
                  <span className="text-sm text-gray-500 font-medium">النتيجة</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-emerald-700">{correct}</p>
                <p className="text-xs text-emerald-600 font-medium">إجابة صحيحة</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <XCircle className="w-7 h-7 text-red-500 mx-auto mb-1" />
                <p className="text-2xl font-bold text-red-600">{incorrect}</p>
                <p className="text-xs text-red-500 font-medium">إجابة خاطئة</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <Award className="w-7 h-7 text-amber-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-amber-700">{total}</p>
                <p className="text-xs text-amber-600 font-medium">إجمالي الأسئلة</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!passed && (
                <Button
                  variant="outline"
                  className="flex-1 border-emerald-600 text-emerald-600 py-5 text-base font-semibold"
                  onClick={() => {
                    // Reset quiz result and navigate back to course detail to retry
                    setQuizResult(null)
                    navigate('course-detail', { courseId: selectedCourseId || '' })
                  }}
                >
                  <RotateCcw className="w-5 h-5 ml-1" />
                  حاول مرة أخرى
                </Button>
              )}
              {passed && (
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-5 text-base font-semibold shadow-lg shadow-emerald-200"
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
                  <Award className="w-5 h-5 ml-1" />
                  احصل على الشهادة
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1 py-5 text-base font-semibold"
                onClick={() => navigate('dashboard')}
              >
                <ArrowRight className="w-5 h-5 ml-1" />
                العودة للوحة التحكم
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
