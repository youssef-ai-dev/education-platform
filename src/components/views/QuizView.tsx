'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ArrowRight, ArrowLeft, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

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
    setLoading(true)
    fetch(`/api/courses/${selectedCourseId}`)
      .then(res => res.json())
      .then(data => {
        const foundQuiz = data.quizzes?.find((q: { id: string }) => q.id === selectedQuizId)
        if (foundQuiz) {
          setQuiz(foundQuiz)
          setAnswers(new Array(foundQuiz.questions.length).fill(-1))
          setTimeLeft(foundQuiz.timeLimit * 60)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">جاري تحميل الاختبار...</p>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]
  const parsedOptions: string[] = JSON.parse(question.options)
  const isWarning = timeLeft < 60
  const isDanger = timeLeft < 30

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer Bar */}
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-gray-900 hidden sm:block">{quiz.title}</h2>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-gray-500">السؤال {currentQuestion + 1} من {quiz.questions.length}</span>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            isDanger ? 'bg-red-100 text-red-700 animate-pulse' :
            isWarning ? 'bg-amber-100 text-amber-700' :
            'bg-emerald-100 text-emerald-700'
          }`}>
            <Clock className="w-4 h-4" />
            <span dir="ltr">{formatTime(timeLeft)}</span>
            {isWarning && <AlertTriangle className="w-4 h-4" />}
          </div>
        </div>
        <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} className="h-1 rounded-none" />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
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
                  {parsedOptions.map((option, idx) => (
                    <div key={idx}>
                      <Label
                        htmlFor={`option-${idx}`}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          answers[currentQuestion] === idx
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                        }`}
                      >
                        <RadioGroupItem value={idx.toString()} id={`option-${idx}`} className="sr-only" />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                          answers[currentQuestion] === idx
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {String.fromCharCode(1571 + idx)}
                        </div>
                        <span className="text-gray-700">{option}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Question Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => { setCurrentQuestion(prev => prev - 1); setShowExplanation(false) }}
                disabled={currentQuestion === 0}
              >
                <ArrowRight className="w-4 h-4 ml-1" />
                السؤال السابق
              </Button>

              <div className="flex gap-1.5">
                {quiz.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentQuestion(idx); setShowExplanation(false) }}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                      idx === currentQuestion ? 'bg-emerald-600 text-white' :
                      answers[idx] >= 0 ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {currentQuestion < quiz.questions.length - 1 ? (
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => { setCurrentQuestion(prev => prev + 1); setShowExplanation(false) }}
                >
                  السؤال التالي
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </Button>
              ) : (
                <Button
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={handleSubmit}
                  disabled={submitted}
                >
                  إنهاء الاختبار
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
