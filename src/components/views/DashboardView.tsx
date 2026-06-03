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
import { BookOpen, Award, CheckCircle, TrendingUp, Star, Play, ArrowLeft, FileQuestion, Clock, Zap, Target, Flame } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

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

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0']

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

  const totalHours = enrollments.reduce((acc, e) => {
    const match = e.course.duration.match(/(\d+)/)
    return acc + (match ? parseInt(match[1]) : 0)
  }, 0)

  // Chart data
  const progressData = enrollments.map(e => ({
    name: e.course.title.length > 15 ? e.course.title.substring(0, 15) + '...' : e.course.title,
    progress: Math.round(e.progress),
    fullTitle: e.course.title,
  }))

  const categoryData = enrollments.reduce((acc: { name: string; value: number }[], e) => {
    const cat = e.course.category
    const existing = acc.find(a => a.name === cat)
    if (existing) existing.value += 1
    else acc.push({ name: cat, value: 1 })
    return acc
  }, [])

  // Weekly activity mock data
  const weeklyData = [
    { day: 'السبت', hours: 1.5 },
    { day: 'الأحد', hours: 2.3 },
    { day: 'الاثنين', hours: 0.8 },
    { day: 'الثلاثاء', hours: 3.1 },
    { day: 'الأربعاء', hours: 1.9 },
    { day: 'الخميس', hours: 2.5 },
    { day: 'الجمعة', hours: 0.5 },
  ]

  const stats = [
    { label: 'الدورات المسجلة', value: enrollments.length, icon: BookOpen, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'الدورات المكتملة', value: completedCourses.length, icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { label: 'الشهادات', value: certificates.length, icon: Award, color: 'bg-amber-100 text-amber-700' },
    { label: 'ساعات التعلم', value: totalHours, icon: Clock, color: 'bg-sky-100 text-sky-700' },
  ]

  if (!studentEmail) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="p-8 text-center border-0 shadow-xl dark:bg-gray-800">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">لوحة التحكم</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">سجّل دخولك لمتابعة تقدمك في الدورات</p>
            <div className="space-y-3 text-right">
              <div className="space-y-2">
                <Label htmlFor="dash-name">الاسم الكامل</Label>
                <Input id="dash-name" placeholder="أدخل اسمك" value={inputName} onChange={(e) => setInputName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dash-email">البريد الإلكتروني</Label>
                <Input id="dash-email" type="email" placeholder="example@email.com" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} dir="ltr" />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4 py-5 text-base font-semibold" onClick={handleLogin}>
                دخول
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-bl from-emerald-600 to-teal-700 dark:from-emerald-800 dark:to-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {studentName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">مرحباً، {studentName} 👋</h1>
              <p className="text-emerald-100">تتبع تقدمك التعليمي وحقق أهدافك</p>
            </div>
          </div>
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
              <Card className="p-5 border-0 shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        {enrollments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Progress Bar Chart */}
            <Card className="lg:col-span-2 border-0 shadow-md p-5 dark:bg-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">تقدم الدورات</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'التقدم']}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="progress" fill="#059669" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Category Pie Chart */}
            <Card className="border-0 shadow-md p-5 dark:bg-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">التخصصات</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {/* Weekly Activity */}
        {enrollments.length > 0 && (
          <Card className="border-0 shadow-md p-5 mb-8 dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">النشاط الأسبوعي</h3>
              <Badge className="bg-emerald-100 text-emerald-700">
                <Flame className="w-3 h-3 ml-1" />
                {weeklyData.reduce((a, d) => a + d.hours, 0).toFixed(1)} ساعة هذا الأسبوع
              </Badge>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value} ساعة`, 'وقت التعلم']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="hours" stroke="#059669" strokeWidth={2} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Enrolled Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">الدورات المسجلة</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <Card key={i} className="animate-pulse border-0 shadow-md dark:bg-gray-800"><CardContent className="p-4"><div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" /></CardContent></Card>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <Card className="p-8 text-center border-0 shadow-md dark:bg-gray-800">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-gray-300 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">لم تسجل في أي دورة بعد</h3>
              <p className="text-gray-400 dark:text-gray-500 mb-4 text-sm">استكشف الدورات المتاحة وابدأ رحلة التعلم</p>
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
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-md dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-28 h-20 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                          {enrollment.course.thumbnailUrl ? (
                            <img src={enrollment.course.thumbnailUrl} alt={enrollment.course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-bl from-emerald-400 to-teal-500 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{enrollment.course.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{enrollment.course.instructor}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress value={enrollment.progress} className="h-2 flex-1" />
                            <span className="text-xs text-gray-500 shrink-0 font-semibold">{Math.round(enrollment.progress)}%</span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-xs h-8 px-3 rounded-lg"
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
                                className="text-xs h-8 px-3 border-amber-300 text-amber-700 rounded-lg"
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">شهاداتي</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden border-amber-200 bg-gradient-to-bl from-amber-50 to-white shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                          <Award className="w-7 h-7 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{cert.courseTitle}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">رقم الشهادة: {cert.certificateId}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700 text-xs rounded-lg"
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
