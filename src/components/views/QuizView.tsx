'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft, Clock, AlertTriangle, CheckCircle2, Zap, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { getCourseById } from '@/lib/static-data'

interface QuizQuestion {
  id: string
  question: string
  options: string
  correctAnswer: number
  explanation: string
}

interface QuizData {
  id: string
  title: string
  timeLimit: number
  passingScore: number
  questions: QuizQuestion[]
  courseId: string
}

const arabicLetters = ['أ', 'ب', 'ج', 'د']

export default function QuizView() {
  const { selectedQuizId, selectedCourseId, navigate, studentEmail, setQuizResult } = useAppStore()
  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!selectedCourseId) return
    const data = getCourseById(selectedCourseId)
    if (data) {
      const foundQuiz = data.quizzes?.find((q: { id: string }) => q.id === selectedQuizId)
      if (foundQuiz) {
        setQuiz(foundQuiz)
        setAnswers(new Array(foundQuiz.questions.length).fill(-1))
        setTimeLeft(foundQuiz.timeLimit * 60)
      }
    }
    setLoading(false)
  }, [selectedCourseId, selectedQuizId])

  // Timer
  useEffect(() => {
    if (!quiz || submitted) return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [quiz, submitted])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitted) return
    setSubmitted(true)
    if (timerRef.current) clearInterval(timerRef.current)

    let correct = 0
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++
    })

    const score = Math.round((correct / quiz.questions.length) * 100)
    const passed = score >= quiz.passingScore

    setQuizResult({ score, total: quiz.questions.length, passed })

    // Save to API
    try {
      const enrollRes = await fetch(`/api/enrollments?email=${encodeURIComponent(studentEmail)}`)
      const enrollments = await enrollRes.json()
      const enrollment = enrollments.find((e: { courseId: string }) => e.courseId === quiz.courseId)

      if (enrollment) {
        await fetch('/api/quiz-attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enrollmentId: enrollment.id,
            quizId: quiz.id,
            answers,
            score,
            passed,
          })
        })
      }
    } catch {
      // Silently fail
    }

    navigate('quiz-result')
  }, [quiz, submitted, answers, studentEmail, setQuizResult, navigate])

  if (loading || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">جاري تحميل الاختبار...</p>
          <div className="mt-3 w-32 h-1 mx-auto bg-emerald-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-l from-emerald-400 to-emerald-600 rounded-full"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const parsedOptions: string[] = JSON.parse(question.options)
  const isWarning = timeLeft < 60
  const isDanger = timeLeft < 30
  const answeredCount = answers.filter(a => a >= 0).length
  const progressPercent = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-emerald-50/20">
      {/* Timer Bar */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-l from-emerald-50 to-emerald-100/60 px-3 py-1.5 rounded-lg">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-emerald-800 text-sm">{quiz.title}</h2>
            </div>
            <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-lg">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-gray-600 font-medium">السؤال <span className="text-gray-900 font-bold">{currentQuestion + 1}</span> من {quiz.questions.length}</span>
            </div>
          </div>

          {/* Premium Timer Badge */}
          <motion.div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
              isDanger
                ? 'bg-gradient-to-l from-red-500 to-red-600 text-white shadow-red-200'
                : isWarning
                ? 'bg-gradient-to-l from-amber-400 to-amber-500 text-white shadow-amber-200'
                : 'bg-gradient-to-l from-emerald-500 to-emerald-600 text-white shadow-emerald-200'
            }`}
            animate={isDanger ? { scale: [1, 1.03, 1] } : {}}
            transition={isDanger ? { repeat: Infinity, duration: 0.8 } : {}}
          >
            <Clock className="w-4 h-4" />
            <span dir="ltr" className="tabular-nums">{formatTime(timeLeft)}</span>
            {isWarning && <AlertTriangle className="w-4 h-4" />}
          </motion.div>
        </div>

        {/* Gradient Progress Bar */}
        <div className="h-1.5 bg-gray-100 relative">
          <motion.div
            className="h-full rounded-l-full"
            style={{
              background: isDanger
                ? 'linear-gradient(to left, #ef4444, #dc2626)'
                : isWarning
                ? 'linear-gradient(to left, #f59e0b, #d97706)'
                : 'linear-gradient(to left, #10b981, #059669)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* Question Card */}
            <Card className="mb-6 border-0 shadow-xl shadow-gray-200/50 overflow-hidden">
              {/* Question Header Accent */}
              <div className="h-1 bg-gradient-to-l from-emerald-400 via-emerald-500 to-teal-500" />
              <CardContent className="p-6 md:p-8">
                {/* Question Number Badge */}
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-200"
                  >
                    <span className="text-white font-bold text-sm">{currentQuestion + 1}</span>
                  </motion.div>
                  <div className="h-px flex-1 bg-gradient-to-l from-gray-200 to-transparent" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
                  {question.question}
                </h3>

                <RadioGroup
                  value={answers[currentQuestion]?.toString()}
                  onValueChange={(value) => {
                    const newAnswers = [...answers]
                    newAnswers[currentQuestion] = parseInt(value)
                    setAnswers(newAnswers)
                  }}
                  className="space-y-3"
                >
                  {parsedOptions.map((option, idx) => {
                    const isSelected = answers[currentQuestion] === idx
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.07 }}
                      >
                        <Label
                          htmlFor={`option-${idx}`}
                          className={`group flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? 'border-emerald-500 bg-gradient-to-l from-emerald-50 to-emerald-100/50 shadow-md shadow-emerald-100'
                              : 'border-gray-100 hover:border-emerald-200 hover:bg-gradient-to-l hover:from-gray-50 hover:to-emerald-50/30 hover:shadow-sm'
                          }`}
                        >
                          <RadioGroupItem value={idx.toString()} id={`option-${idx}`} className="sr-only" />
                          <motion.div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 transition-all duration-300 ${
                              isSelected
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200'
                                : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-500 group-hover:from-emerald-50 group-hover:to-emerald-100 group-hover:text-emerald-600'
                            }`}
                            whileTap={{ scale: 0.9 }}
                          >
                            {arabicLetters[idx]}
                          </motion.div>
                          <span className={`text-base transition-colors duration-300 ${
                            isSelected ? 'text-emerald-800 font-semibold' : 'text-gray-700'
                          }`}>{option}</span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="mr-auto"
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </motion.div>
                          )}
                        </Label>
                      </motion.div>
                    )
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Question Navigation */}
            <div className="flex items-center justify-between gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={() => { setCurrentQuestion(prev => prev - 1); setShowExplanation(false) }}
                  disabled={currentQuestion === 0}
                  className="border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 px-5 py-5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-40"
                >
                  <ArrowRight className="w-4 h-4 ml-1" />
                  السؤال السابق
                </Button>
              </motion.div>

              {/* Question Dots */}
              <div className="hidden sm:flex gap-1.5">
                {quiz.questions.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => { setCurrentQuestion(idx); setShowExplanation(false) }}
                    className={`relative w-9 h-9 rounded-xl text-xs font-bold transition-all duration-300 ${
                      idx === currentQuestion
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200'
                        : answers[idx] >= 0
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {idx + 1}
                    {answers[idx] >= 0 && idx !== currentQuestion && (
                      <span className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Mobile: compact dots */}
              <div className="flex sm:hidden gap-1">
                {quiz.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentQuestion(idx); setShowExplanation(false) }}
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                      idx === currentQuestion
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white'
                        : answers[idx] >= 0
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {currentQuestion < quiz.questions.length - 1 ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-5 py-5 rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all duration-300"
                    onClick={() => { setCurrentQuestion(prev => prev + 1); setShowExplanation(false) }}
                  >
                    السؤال التالي
                    <ArrowLeft className="w-4 h-4 mr-1" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="bg-gradient-to-l from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-5 py-5 rounded-xl font-semibold shadow-lg shadow-amber-200 transition-all duration-300"
                    onClick={handleSubmit}
                    disabled={submitted}
                  >
                    <CheckCircle2 className="w-4 h-4 ml-1" />
                    إنهاء الاختبار
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Answered Progress Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-400">
                تم الإجابة على <span className="font-bold text-emerald-600">{answeredCount}</span> من <span className="font-bold text-gray-600">{quiz.questions.length}</span> سؤال
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
