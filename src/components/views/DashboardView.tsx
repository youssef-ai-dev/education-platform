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
      // Use static data directly for courses - API is optional for enrollments/certificates
      setLoading(false)
      // Try API first for enrollments/certificates (user-specific data)
      try {
        Promise.all([
          fetch(`/api/enrollments?email=${encodeURIComponent(studentEmail)}`).then(r => r.json()).catch(() => []),
          fetch(`/api/certificates?email=${encodeURIComponent(studentEmail)}`).then(r => r.json()).catch(() => [])
        ]).then(([enrollData, certData]) => {
          setEnrollments(Array.isArray(enrollData) ? enrollData : [])
          setCertificates(Array.isArray(certData) ? certData : [])
        })
      } catch {
        setEnrollments([])
        setCertificates([])
      }
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
    { label: 'الدورات المسجلة', value: enrollments.length, icon: BookOpen, gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
    { label: 'الدورات المكتملة', value: completedCourses.length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
    { label: 'الشهادات', value: certificates.length, icon: Award, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
    { label: 'ساعات التعلم', value: totalHours, icon: Clock, gradient: 'from-sky-500 to-cyan-600', bg: 'bg-sky-50' },
  ]

  if (!studentEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full mx-4 relative z-10"
        >
          <Card className="overflow-hidden border-0 shadow-2xl shadow-emerald-900/10 bg-white">
            {/* Top gradient accent */}
            <div className="h-1.5 bg-gradient-to-l from-emerald-500 via-teal-500 to-emerald-600" />
            <div className="p-8 text-center">
              {/* Logo icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30"
              >
                <BookOpen className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-1.5"
              >
                لوحة التحكم
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-gray-500 mb-7 text-sm"
              >
                سجّل دخولك لمتابعة تقدمك في الدورات
              </motion.p>
              <div className="space-y-4 text-right">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="dash-name" className="text-gray-700 font-medium text-sm">الاسم الكامل</Label>
                  <Input
                    id="dash-name"
                    placeholder="أدخل اسمك"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 transition-all duration-200 text-right placeholder:text-gray-300"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="space-y-2"
                >
                  <Label htmlFor="dash-email" className="text-gray-700 font-medium text-sm">البريد الإلكتروني</Label>
                  <Input
                    id="dash-email"
                    type="email"
                    placeholder="example@email.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    dir="ltr"
                    className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 transition-all duration-200 placeholder:text-gray-300"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 mt-2 py-5.5 h-12 text-base font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                    onClick={handleLogin}
                  >
                    دخول
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 relative">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="bg-gradient-to-bl from-emerald-600 via-emerald-700 to-teal-800 text-white py-10 relative">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold ring-2 ring-white/20 shadow-lg">
                  {studentName.charAt(0)}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 ring-2 ring-emerald-700" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">مرحباً، {studentName} 👋</h1>
                <p className="text-emerald-200 mt-0.5 text-sm font-medium">تتبع تقدمك التعليمي وحقق أهدافك</p>
              </motion.div>
              <div className="mr-auto">
                <Button
                  variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5 text-sm font-medium"
                  onClick={() => setLoginOpen(true)}
                >
                  <Zap className="w-4 h-4" />
                  تبديل الحساب
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom curve */}
        <div className="h-6 bg-gradient-to-bl from-emerald-600 via-emerald-700 to-teal-800" />
        <div className="-mt-6 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 rounded-t-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pb-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="group border border-gray-100/80 bg-white shadow-sm hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                      <p className="text-[11px] text-gray-400 font-semibold tracking-wide mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        {enrollments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            {/* Progress Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="lg:col-span-2 border border-gray-100/80 bg-white shadow-sm overflow-hidden h-full">
                <div className="p-5 pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">تقدم الدورات</h3>
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold px-2.5">
                      <TrendingUp className="w-3 h-3 ml-1" />
                      {enrollments.length} دورة
                    </Badge>
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <div className="h-64 bg-gray-50/50 rounded-xl p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={progressData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(value: number) => [`${value}%`, 'التقدم']}
                          contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '13px' }}
                        />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#059669" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                        <Bar dataKey="progress" fill="url(#barGradient)" radius={[0, 6, 6, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Category Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border border-gray-100/80 bg-white shadow-sm overflow-hidden h-full">
                <div className="p-5 pb-0">
                  <h3 className="font-bold text-gray-900 text-lg mb-4">التخصصات</h3>
                </div>
                <div className="px-5 pb-5">
                  <div className="h-64 bg-gray-50/50 rounded-xl p-2">
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
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '13px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Weekly Activity */}
        {enrollments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="border border-gray-100/80 bg-white shadow-sm overflow-hidden mb-8">
              <div className="p-5 pb-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">النشاط الأسبوعي</h3>
                  <Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-semibold px-2.5">
                    <Flame className="w-3 h-3 ml-1" />
                    {weeklyData.reduce((a, d) => a + d.hours, 0).toFixed(1)} ساعة هذا الأسبوع
                  </Badge>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="h-48 bg-gray-50/50 rounded-xl p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value: number) => [`${value} ساعة`, 'وقت التعلم']}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '13px' }}
                      />
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="hours" stroke="#059669" strokeWidth={2.5} fill="url(#colorHours)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Enrolled Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">الدورات المسجلة</h2>
            {enrollments.length > 0 && (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
                {enrollments.length} دورة
              </Badge>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <Card key={i} className="animate-pulse border border-gray-100/80 bg-white shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      <div className="w-28 h-20 rounded-xl bg-gray-100" />
                      <div className="flex-1 space-y-2.5">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-2 bg-gray-100 rounded w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : enrollments.length === 0 ? (
            <Card className="border border-gray-100/80 bg-white shadow-sm">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-9 h-9 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1.5">لم تسجل في أي دورة بعد</h3>
                <p className="text-gray-400 mb-5 text-sm">استكشف الدورات المتاحة وابدأ رحلة التعلم</p>
                <Button
                  className="bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all duration-300"
                  onClick={() => navigate('courses')}
                >
                  استكشف الدورات
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrollments.map((enrollment, i) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="group border border-gray-100/80 bg-white shadow-sm hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className="w-28 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          {enrollment.course.thumbnailUrl ? (
                            <img src={enrollment.course.thumbnailUrl} alt={enrollment.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center relative">
                              <div className="absolute inset-0 opacity-20" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
                              }} />
                              <BookOpen className="w-7 h-7 text-white/60 relative z-10" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-emerald-700 transition-colors duration-200">{enrollment.course.title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5 font-medium">{enrollment.course.instructor}</p>
                          <div className="flex items-center gap-2.5 mt-2.5">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.round(enrollment.progress)}%` }}
                                transition={{ delay: i * 0.08 + 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full bg-gradient-to-l from-emerald-500 to-teal-500 rounded-full"
                              />
                            </div>
                            <span className="text-[11px] text-emerald-700 font-bold shrink-0">{Math.round(enrollment.progress)}%</span>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              className="bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs h-8 px-3.5 rounded-lg shadow-sm shadow-emerald-500/20 transition-all duration-200"
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
                                className="text-xs h-8 px-3 border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 rounded-lg transition-colors duration-200"
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
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">شهاداتي</h2>
              <Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold">
                {certificates.length} شهادة
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="group overflow-hidden border border-amber-200/60 bg-gradient-to-bl from-amber-50/80 via-white to-orange-50/50 shadow-sm hover:shadow-lg hover:shadow-amber-900/5 transition-all duration-300 hover:-translate-y-0.5">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                          <Award className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{cert.courseTitle}</h3>
                          <p className="text-xs text-gray-400 mt-0.5 font-medium">رقم الشهادة: {cert.certificateId}</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-xs rounded-lg shadow-sm shadow-amber-500/20 transition-all duration-200 text-white"
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

      {/* Login dialog for switching accounts */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تسجيل الدخول</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-right">
            <div className="space-y-2">
              <Label htmlFor="dialog-name" className="text-gray-700 font-medium text-sm">الاسم الكامل</Label>
              <Input
                id="dialog-name"
                placeholder="أدخل اسمك"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-email" className="text-gray-700 font-medium text-sm">البريد الإلكتروني</Label>
              <Input
                id="dialog-email"
                type="email"
                placeholder="example@email.com"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                dir="ltr"
                className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50"
              />
            </div>
            <Button
              className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11 shadow-md shadow-emerald-500/20 font-semibold"
              onClick={handleLogin}
            >
              دخول
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
