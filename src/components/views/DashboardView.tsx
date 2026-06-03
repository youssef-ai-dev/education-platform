'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Award, CheckCircle, TrendingUp, Star, Play, ArrowLeft, FileQuestion } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface Enrollment {
  id: string
  studentName: string
  studentEmail: string
  courseId: string
  progress: number
  enrolledAt: string
  completedAt: string | null
  course: {
    id: string
    title: string
    category: string
    thumbnailUrl: string | null
    instructor: string
    duration: string
    rating: number
    lessons: { id: string; title: string }[]
    quizzes: { id: string; title: string }[]
  }
  quizAttempts: { id: string; score: number; passed: boolean; quizId: string }[]
  certificate: { id: string; certificateId: string; courseTitle: string } | null
}

export default function DashboardView() {
  const { studentEmail, studentName, setStudentInfo, navigate } = useAppStore()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)
  const [inputEmail, setInputEmail] = useState('')
  const [inputName, setInputName] = useState('')

  const fetchEnrollments = async (email: string) => {
    try {
      const [enrollRes, certRes] = await Promise.all([
        fetch(`/api/enrollments?email=${encodeURIComponent(email)}`),
        fetch(`/api/certificates?email=${encodeURIComponent(email)}`)
      ])
      const enrollData = await enrollRes.json()
      const certData = await certRes.json()
      setEnrollments(Array.isArray(enrollData) ? enrollData : [])
      setCertificates(Array.isArray(certData) ? certData : [])
      setLoading(false)
    } catch {
      setEnrollments([])
      setCertificates([])
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentEmail) {
      let cancelled = false
      Promise.all([
        fetch(`/api/enrollments?email=${encodeURIComponent(studentEmail)}`),
        fetch(`/api/certificates?email=${encodeURIComponent(studentEmail)}`)
      ]).then(([enrollRes, certRes]) => {
        return Promise.all([enrollRes.json(), certRes.json()])
      }).then(([enrollData, certData]) => {
        if (cancelled) return
        setEnrollments(Array.isArray(enrollData) ? enrollData : [])
        setCertificates(Array.isArray(certData) ? certData : [])
        setLoading(false)
      }).catch(() => {
        if (!cancelled) {
          setEnrollments([])
          setCertificates([])
          setLoading(false)
        }
      })
      return () => { cancelled = true }
    }
  }, [studentEmail])

  const handleLogin = () => {
    if (!inputEmail.trim() || !inputName.trim()) {
      toast.error('يرجى إدخال الاسم والبريد الإلكتروني')
      return
    }
    setStudentInfo(inputName, inputEmail)
    setLoginOpen(false)
    fetchEnrollments(inputEmail)
    toast.success('مرحباً بك!')
  }

  const completedCourses = enrollments.filter(e => e.progress >= 100)
  const avgScore = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => {
        const scores = e.quizAttempts.map(a => a.score)
        return acc + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0)
      }, 0) / enrollments.length)
    : 0

  const stats = [
    { label: 'الدورات المسجلة', value: enrollments.length, icon: BookOpen, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'الدورات المكتملة', value: completedCourses.length, icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { label: 'الشهادات', value: certificates.length, icon: Award, color: 'bg-amber-100 text-amber-700' },
    { label: 'معدل الاختبارات', value: `${avgScore}%`, icon: TrendingUp, color: 'bg-sky-100 text-sky-700' },
  ]

  if (!studentEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">لوحة التحكم</h2>
            <p className="text-gray-600 mb-6">سجّل دخولك لمتابعة تقدمك في الدورات</p>
            <div className="space-y-3 text-right">
              <div className="space-y-2">
                <Label htmlFor="dash-name">الاسم الكامل</Label>
                <Input id="dash-name" placeholder="أدخل اسمك" value={inputName} onChange={(e) => setInputName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dash-email">البريد الإلكتروني</Label>
                <Input id="dash-email" type="email" placeholder="example@email.com" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} dir="ltr" />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4" onClick={handleLogin}>
                دخول
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-bl from-emerald-600 to-teal-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">مرحباً، {studentName} 👋</h1>
          <p className="text-emerald-100">تتبع تقدمك التعليمي وحقق أهدافك</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">الدورات المسجلة</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <Card key={i} className="animate-pulse"><CardContent className="p-4"><div className="h-24 bg-gray-200 rounded" /></CardContent></Card>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">لم تسجل في أي دورة بعد</h3>
              <p className="text-gray-400 mb-4 text-sm">استكشف الدورات المتاحة وابدأ رحلة التعلم</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate('courses')}>
                استكشف الدورات
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrollments.map((enrollment, i) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-16 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                          {enrollment.course.thumbnailUrl ? (
                            <img src={enrollment.course.thumbnailUrl} alt={enrollment.course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-bl from-emerald-400 to-teal-500 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{enrollment.course.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{enrollment.course.instructor}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={enrollment.progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-gray-500 shrink-0">{Math.round(enrollment.progress)}%</span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-xs h-7"
                              onClick={() => {
                                const firstLesson = enrollment.course.lessons[0]
                                if (firstLesson) {
                                  navigate('lesson', { lessonId: firstLesson.id, courseId: enrollment.courseId })
                                } else {
                                  navigate('course-detail', { courseId: enrollment.courseId })
                                }
                              }}
                            >
                              <Play className="w-3 h-3 ml-1" />
                              {enrollment.progress > 0 ? 'متابعة' : 'ابدأ'}
                            </Button>
                            {enrollment.course.quizzes.length > 0 && enrollment.progress > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 border-amber-300 text-amber-700"
                                onClick={() => navigate('quiz', { quizId: enrollment.course.quizzes[0].id, courseId: enrollment.courseId })}
                              >
                                <FileQuestion className="w-3 h-3 ml-1" />
                                الاختبار
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Certificates */}
        {certificates.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">شهاداتي</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden border-amber-200 bg-gradient-to-bl from-amber-50 to-white">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                          <Award className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{cert.courseTitle}</h3>
                          <p className="text-xs text-gray-500">رقم الشهادة: {cert.certificateId}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-xs"
                          onClick={() => navigate('certificate', { certificateId: cert.certificateId })}
                        >
                          عرض
                          <ArrowLeft className="w-3 h-3 mr-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
