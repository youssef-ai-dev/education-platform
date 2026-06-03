'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Star, Users, Clock, Play, Lock, Unlock, CheckCircle, BookOpen, FileQuestion, ArrowLeft, ArrowRight, Monitor, Award, Download, Shield, Sparkles, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  order: number
  isFree: boolean
}

interface Quiz {
  id: string
  title: string
  timeLimit: number
  passingScore: number
  questions: { id: string }[]
}

interface CourseDetail {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string | null
  instructor: string
  duration: string
  rating: number
  studentsCount: number
  price: number
  level: string
  lessons: Lesson[]
  quizzes: Quiz[]
  enrollments: { id: string; studentEmail: string; progress: number }[]
}

export default function CourseDetailView() {
  const { selectedCourseId, navigate, studentEmail, studentName, setStudentInfo } = useAppStore()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrollment, setEnrollment] = useState<{ id: string; progress: number } | null>(null)
  const [enrollOpen, setEnrollOpen] = useState(false)
  const [enrollName, setEnrollName] = useState(studentName)
  const [enrollEmail, setEnrollEmail] = useState(studentEmail)
  const [enrolling, setEnrolling] = useState(false)
  const [hoveredLesson, setHoveredLesson] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedCourseId) return
    // Use static data directly - works on any hosting platform
    try {
      const { getCourseById } = require('@/lib/static-data')
      const data = getCourseById(selectedCourseId)
      if (data) {
        setCourse(data as any)
        if (studentEmail) {
          const existing = data.enrollments?.find((e: { studentEmail: string }) => e.studentEmail === studentEmail)
          if (existing) {
            setEnrollment({ id: existing.id, progress: existing.progress })
          }
        }
      }
      setLoading(false)
    } catch {
      // Fallback to API
      fetch(`/api/courses/${selectedCourseId}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch course')
          return res.json()
        })
        .then(data => {
          setCourse(data)
          const existing = data.enrollments?.find((e: { studentEmail: string }) => e.studentEmail === studentEmail)
          if (existing) {
            setEnrollment({ id: existing.id, progress: existing.progress })
          }
          setLoading(false)
        })
        .catch(() => { setLoading(false) })
    }
  }, [selectedCourseId, studentEmail])

  const handleEnroll = async () => {
    if (!enrollName.trim() || !enrollEmail.trim()) {
      toast.error('يرجى إدخال الاسم والبريد الإلكتروني')
      return
    }
    setEnrolling(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: enrollName,
          studentEmail: enrollEmail,
          courseId: selectedCourseId
        })
      })
      const data = await res.json()
      if (res.ok) {
        setStudentInfo(enrollName, enrollEmail)
        setEnrollment({ id: data.id, progress: 0 })
        toast.success('تم التسجيل في الدورة بنجاح!')
        setEnrollOpen(false)
      } else if (res.status === 409) {
        setStudentInfo(enrollName, enrollEmail)
        setEnrollment({ id: data.enrollment.id, progress: data.enrollment.progress })
        toast.info('أنت مسجل بالفعل في هذه الدورة')
        setEnrollOpen(false)
      } else {
        toast.error(data.error || 'حدث خطأ أثناء التسجيل')
      }
    } catch {
      toast.error('حدث خطأ أثناء التسجيل')
    }
    setEnrolling(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/80 py-8">
        <div className="max-w-7xl mx-auto px-4 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-72 bg-gray-200 rounded-2xl" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50/80 flex items-center justify-center">
        <p className="text-gray-500 text-lg">الدورة غير موجودة</p>
      </div>
    )
  }

  const isEnrolled = !!enrollment
  const totalLessons = course.lessons?.length ?? 0
  const completedLessons = isEnrolled ? Math.round((enrollment.progress / 100) * totalLessons) : 0

  return (
    <div className="min-h-screen bg-gray-50/80" dir="rtl">
      {/* Course Header */}
      <div className="relative overflow-hidden">
        {/* Dramatic gradient background with mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-bl from-emerald-700 via-emerald-600 to-teal-800" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
                           radial-gradient(at 80% 20%, rgba(16,185,129,0.3) 0%, transparent 50%),
                           radial-gradient(at 50% 50%, rgba(20,184,166,0.2) 0%, transparent 60%)`
        }} />
        {/* Mesh dot pattern */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigate('courses')}
            className="text-emerald-200 hover:text-white mb-6 flex items-center gap-2 text-sm group transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
            العودة للدورات
          </motion.button>

          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex-1 flex flex-col justify-center"
            >
              {/* Badges with backdrop-blur */}
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-white/15 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors px-3 py-1 text-xs font-medium">
                  {course.category}
                </Badge>
                <Badge className="bg-white/15 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-colors px-3 py-1 text-xs font-medium">
                  <Sparkles className="w-3 h-3 ml-1" />
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
                {course.title}
              </h1>
              <p className="text-emerald-100/90 mb-6 leading-relaxed text-base max-w-2xl">{course.description}</p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-emerald-100/90 mb-6">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-white">{course.rating}</span>
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {course.studentsCount} طالب
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
                <span className="w-px h-4 bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {totalLessons} درس
                </span>
              </div>

              {/* Instructor section */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 w-fit border border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <p className="text-emerald-200 text-xs">مدرب الدورة</p>
                  <p className="font-semibold text-white text-sm">{course.instructor}</p>
                </div>
                <Shield className="w-4 h-4 text-emerald-300 mr-2" />
              </div>
            </motion.div>

            {/* Sidebar Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:w-[340px] shrink-0"
            >
              <Card className="bg-white text-gray-900 overflow-hidden h-full rounded-2xl border-0 shadow-2xl shadow-emerald-900/20 group/sidebar hover:shadow-emerald-900/30 transition-shadow duration-500 relative">
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-500 p-[1.5px] bg-gradient-to-br from-emerald-400 via-teal-400 to-emerald-600 pointer-events-none" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />

                {/* Video Preview */}
                <div className="aspect-video bg-gray-900 relative group cursor-pointer overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-bl from-gray-800 via-gray-850 to-gray-900" />
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />

                  {/* Play button with glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      {/* Glow rings */}
                      <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping opacity-30" style={{ transform: 'scale(1.3)' }} />
                      <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-pulse" style={{ transform: 'scale(1.15)' }} />
                      <div className="relative w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-emerald-500/30">
                        <Play className="w-7 h-7 text-emerald-600 mr-[-2px]" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Preview badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/50 backdrop-blur-md text-white text-xs border-0">
                      معاينة
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Price display with background highlight */}
                  <div className="bg-gradient-to-l from-emerald-50 to-teal-50 rounded-xl p-4 mb-5 border border-emerald-100/50">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold bg-gradient-to-l from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {course.price === 0 ? 'مجاني' : `${course.price}`}
                      </span>
                      {course.price !== 0 && (
                        <span className="text-sm text-gray-500 font-medium">ر.س</span>
                      )}
                    </div>
                    {course.price !== 0 && (
                      <p className="text-xs text-gray-400 mt-1">شامل جميع الدروس والاختبارات</p>
                    )}
                  </div>

                  {isEnrolled ? (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600 font-medium">التقدم</span>
                          <span className="font-bold text-emerald-600">{Math.round(enrollment.progress)}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2.5" />
                        <p className="text-xs text-gray-400 mt-2">{completedLessons} من {totalLessons} درس مكتمل</p>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-base py-6 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
                        onClick={() => {
                          const firstLesson = course.lessons[0]
                          if (firstLesson) navigate('lesson', { lessonId: firstLesson.id, courseId: course.id })
                        }}
                      >
                        <GraduationCap className="w-5 h-5 ml-2" />
                        ابدأ التعلم
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </Button>
                    </div>
                  ) : (
                    <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-base py-6 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all">
                          <Sparkles className="w-4 h-4 ml-2" />
                          سجّل الآن
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl" dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="text-right text-xl">التسجيل في الدورة</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5 pt-2">
                          <div className="bg-gradient-to-l from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                            <p className="font-semibold text-gray-800 text-sm">{course.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{course.instructor} • {totalLessons} درس</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">الاسم الكامل</Label>
                            <Input
                              id="name"
                              placeholder="أدخل اسمك"
                              value={enrollName}
                              onChange={(e) => setEnrollName(e.target.value)}
                              className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11 bg-gray-50/50 focus:bg-white transition-colors"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="example@email.com"
                              value={enrollEmail}
                              onChange={(e) => setEnrollEmail(e.target.value)}
                              dir="ltr"
                              className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11 bg-gray-50/50 focus:bg-white transition-colors text-left"
                            />
                          </div>
                          <Button
                            className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 rounded-xl text-base font-semibold shadow-lg shadow-emerald-500/20"
                            onClick={handleEnroll}
                            disabled={enrolling}
                          >
                            {enrolling ? (
                              <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                جاري التسجيل...
                              </span>
                            ) : 'تأكيد التسجيل'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Feature list with colored icon backgrounds */}
                  <div className="mt-6 space-y-3">
                    <div className="h-px bg-gradient-to-l from-transparent via-gray-200 to-transparent mb-4" />
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <Monitor className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span>{totalLessons} درس تعليمي</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-teal-600" />
                      </div>
                      <span>مدة الدورة: {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                        <FileQuestion className="w-4 h-4 text-amber-600" />
                      </div>
                      <span>{course.quizzes?.length ?? 0} اختبار</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>شهادة إتمام</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                        <Download className="w-4 h-4 text-sky-600" />
                      </div>
                      <span>موارد قابلة للتحميل</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:max-w-4xl">
          <Tabs defaultValue="curriculum" className="w-full">
            {/* Premium tab design */}
            <TabsList className="w-full justify-start bg-white border border-gray-200/80 rounded-2xl p-1.5 h-auto gap-1 shadow-sm">
              <TabsTrigger
                value="overview"
                className="relative px-6 py-2.5 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-l data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20 transition-all duration-300"
              >
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger
                value="curriculum"
                className="relative px-6 py-2.5 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-l data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20 transition-all duration-300"
              >
                المنهج
              </TabsTrigger>
              <TabsTrigger
                value="quizzes"
                className="relative px-6 py-2.5 text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-l data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20 transition-all duration-300"
              >
                الاختبارات
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-bold mb-2">عن هذه الدورة</h3>
                <div className="h-1 w-12 bg-gradient-to-l from-emerald-500 to-teal-500 rounded-full mb-5" />
                <p className="text-gray-600 leading-relaxed mb-8">{course.description}</p>

                <h4 className="font-semibold mb-4 text-lg">ماذا ستتعلم</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(course.lessons ?? []).map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50/80 rounded-xl px-4 py-3 hover:bg-emerald-50/60 transition-colors"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span>{lesson.title}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Curriculum header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold">محتوى الدورة</h3>
                  <span className="text-sm text-gray-500">{totalLessons} درس • {course.duration}</span>
                </div>

                {(course.lessons ?? []).map((lesson, index) => {
                  const isAccessible = lesson.isFree || isEnrolled
                  const isHovered = hoveredLesson === lesson.id
                  const progressPercent = isEnrolled && enrollment ? Math.min(100, (completedLessons / (index + 1)) * 100) : 0
                  const isCompleted = isEnrolled && index < completedLessons

                  return (
                    <Card
                      key={lesson.id}
                      className={`overflow-hidden transition-all duration-300 rounded-xl border-0 shadow-sm ${
                        isAccessible ? 'cursor-pointer' : 'opacity-80'
                      } ${
                        isHovered && isAccessible
                          ? 'shadow-md ring-1 ring-emerald-200'
                          : ''
                      }`}
                      onClick={() => {
                        if (isAccessible) {
                          navigate('lesson', { lessonId: lesson.id, courseId: course.id })
                        } else {
                          toast.error('يرجى التسجيل في الدورة للوصول لهذا الدرس')
                        }
                      }}
                      onMouseEnter={() => setHoveredLesson(lesson.id)}
                      onMouseLeave={() => setHoveredLesson(null)}
                    >
                      {/* Left border accent */}
                      <div className={`absolute right-0 top-0 bottom-0 w-1 rounded-r-xl transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-b from-emerald-400 to-teal-500'
                          : isHovered && isAccessible
                            ? 'bg-gradient-to-b from-emerald-400 to-teal-500'
                            : 'bg-gray-200'
                      }`} />

                      <CardContent className="p-4 flex items-center gap-4 relative">
                        {/* Numbering circle with gradient */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                            : isHovered && isAccessible
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                              : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{lesson.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5">
                            <p className="text-xs text-gray-400">{lesson.duration}</p>
                            {/* Subtle progress indicator */}
                            {isEnrolled && (
                              <div className="flex-1 max-w-[120px]">
                                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-l from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                                    style={{ width: `${isCompleted ? 100 : 0}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {lesson.isFree && (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50/50 text-xs font-medium rounded-lg px-2">
                              مجاني
                            </Badge>
                          )}
                          {isAccessible ? (
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                              <Unlock className="w-4 h-4 text-emerald-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isHovered && isAccessible ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400'
                          }`}>
                            <Play className="w-3.5 h-3.5" fill="currentColor" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </motion.div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {(course.quizzes ?? []).map((quiz, index) => (
                  <Card
                    key={quiz.id}
                    className="overflow-hidden rounded-xl border-0 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        {/* Gradient accent strip */}
                        <div className="w-2 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-xl shrink-0" />

                        <div className="flex-1 flex items-center justify-between p-5 gap-4">
                          <div className="flex items-center gap-4">
                            {/* Icon container */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center shrink-0 group-hover:from-amber-100 group-hover:to-amber-150 transition-colors">
                              <FileQuestion className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                              <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <FileQuestion className="w-3.5 h-3.5" />
                                  {quiz.questions?.length ?? 0} سؤال
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {quiz.timeLimit} دقيقة
                                </span>
                                <span className="text-emerald-600 font-medium">درجة النجاح: {quiz.passingScore}%</span>
                              </div>
                            </div>
                          </div>

                          {isEnrolled ? (
                            <Button
                              className="bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all shrink-0"
                              onClick={() => navigate('quiz', { quizId: quiz.id, courseId: course.id })}
                            >
                              ابدأ الاختبار
                              <ArrowLeft className="w-4 h-4 mr-1" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 shrink-0"
                              onClick={() => setEnrollOpen(true)}
                            >
                              سجّل للوصول
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {course.quizzes?.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <FileQuestion className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد اختبارات لهذه الدورة بعد</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
