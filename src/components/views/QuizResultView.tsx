'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Award, RotateCcw, ArrowRight, Trophy, Star, Sparkles, Target, Hash } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function QuizResultView() {
  const { quizResult, selectedCourseId, navigate, studentEmail, setQuizResult } = useAppStore()

  useEffect(() => {
    if (quizResult?.passed) {
      // Fire confetti when quiz is passed!
      const duration = 3000
      const end = Date.now() + duration

      const colors = ['#059669', '#10b981', '#34d399', '#f59e0b', '#fbbf24', '#d97706']

      ;(function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 65,
          origin: { x: 0, y: 0.7 },
          colors,
        })
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 65,
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50/20 flex items-center justify-center">
        <p className="text-gray-500 font-medium">لا توجد نتيجة للاختبار</p>
      </div>
    )
  }

  const { score, total, passed } = quizResult
  const percentage = Math.round((score / total) * 100)
  const correct = score
  const incorrect = total - score

  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const gradientId = passed ? 'scoreGradientPass' : 'scoreGradientFail'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-emerald-50/30 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={false}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-lg w-full"
      >
        <Card className="overflow-hidden border-0 shadow-2xl shadow-gray-300/40">
          {/* Header */}
          <div className={`relative p-10 text-center overflow-hidden ${
            passed
              ? 'bg-gradient-to-bl from-emerald-500 via-emerald-600 to-teal-700'
              : 'bg-gradient-to-bl from-red-500 via-red-600 to-rose-700'
          }`}>
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white/20 -translate-x-8 -translate-y-8" />
              <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white/10 translate-x-10 translate-y-10" />
              <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Decorative stars for passed state */}
            {passed && (
              <>
                <motion.div
                  initial={false}
                  animate={{ opacity: 0.25, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute top-3 right-5"
                >
                  <Star className="w-8 h-8 text-amber-200" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ opacity: 0.2, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="absolute bottom-4 left-8"
                >
                  <Star className="w-6 h-6 text-amber-200" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ opacity: 0.15, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="absolute top-8 left-16"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ opacity: 0.15, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="absolute bottom-8 right-16"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </>
            )}

            {/* Trophy / X Icon */}
            {passed ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                className="relative z-10"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full" />
                  <Trophy className="w-24 h-24 text-amber-300 mx-auto mb-5 drop-shadow-lg relative" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="relative z-10"
              >
                <XCircle className="w-20 h-20 text-white/80 mx-auto mb-5" />
              </motion.div>
            )}

            <motion.h2
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative z-10 text-2xl md:text-3xl font-extrabold text-white mb-2"
            >
              {passed ? 'مبروك! لقد نجحت! 🎉' : 'لم تنجح هذه المرة'}
            </motion.h2>
            <motion.p
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="relative z-10 text-white/75 text-lg font-medium"
            >
              {passed ? 'أحسنت! واصل تقدمك الرائع' : 'لا تقلق، يمكنك المحاولة مرة أخرى'}
            </motion.p>
          </div>

          <CardContent className="p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Score Circle */}
              <motion.div variants={itemVariants} className="flex justify-center mb-10">
                <div className="relative w-52 h-52">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        {passed ? (
                          <>
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#059669" />
                            <stop offset="100%" stopColor="#047857" />
                          </>
                        ) : (
                          <>
                            <stop offset="0%" stopColor="#f87171" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#dc2626" />
                          </>
                        )}
                      </linearGradient>
                      <filter id="circleShadow">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                      </filter>
                    </defs>
                    <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="10" fill="none" />
                    <motion.circle
                      cx="80" cy="80" r="70"
                      stroke={`url(#${gradientId})`}
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
                      filter="url(#circleShadow)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={false}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
                      className="text-5xl font-black text-gray-900 tabular-nums"
                    >
                      {percentage}%
                    </motion.span>
                    <span className="text-sm text-gray-400 font-semibold mt-1">النتيجة</span>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-10">
                <div className="text-center p-4 bg-gradient-to-b from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-100 shadow-sm">
                  <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-black text-emerald-700">{correct}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">إجابة صحيحة</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-red-50 to-red-100/50 rounded-2xl border border-red-100 shadow-sm">
                  <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md shadow-red-200">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-black text-red-600">{incorrect}</p>
                  <p className="text-[11px] text-red-500 font-semibold mt-0.5">إجابة خاطئة</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-amber-50 to-amber-100/50 rounded-2xl border border-amber-100 shadow-sm">
                  <div className="w-11 h-11 mx-auto mb-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-200">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-black text-amber-700">{total}</p>
                  <p className="text-[11px] text-amber-600 font-semibold mt-0.5">إجمالي الأسئلة</p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
                {!passed && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-emerald-300 text-emerald-700 hover:bg-gradient-to-l hover:from-emerald-50 hover:to-emerald-100 py-5 text-base font-bold rounded-xl shadow-sm transition-all duration-300"
                      onClick={() => {
                        setQuizResult(null)
                        navigate('course-detail', { courseId: selectedCourseId || '' })
                      }}
                    >
                      <RotateCcw className="w-5 h-5 ml-2" />
                      حاول مرة أخرى
                    </Button>
                  </motion.div>
                )}
                {passed && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      className="w-full bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 py-5 text-base font-bold shadow-lg shadow-emerald-300/50 rounded-xl transition-all duration-300"
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
                      <Award className="w-5 h-5 ml-2" />
                      احصل على الشهادة
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-5 text-base font-bold rounded-xl transition-all duration-300"
                    onClick={() => navigate('dashboard')}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                    العودة للوحة التحكم
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
