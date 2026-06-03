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
import { Star, Users, Clock, Play, Lock, Unlock, CheckCircle, BookOpen, FileQuestion, ArrowLeft, ArrowRight, Monitor, Award, Download } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

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

  useEffect(() => {
    if (!selectedCourseId) return
    let cancelled = false
    fetch(`/api/courses/${selectedCourseId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch course')
        return res.json()
      })
      .then(data => {
        if (cancelled) return
        setCourse(data)
        const existing = data.enrollments?.find((e: { studentEmail: string }) => e.studentEmail === studentEmail)
        if (existing) {
          setEnrollment({ id: existing.id, progress: existing.progress })
        }
        setLoading(false)
      })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">الدورة غير موجودة</p>
      </div>
    )
  }

  const isEnrolled = !!enrollment

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-gradient-to-bl from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => navigate('courses')} className="text-emerald-200 hover:text-white mb-4 flex items-center gap-1 text-sm">
            <ArrowRight className="w-4 h-4" />
            العودة للدورات
          </button>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-white/20 text-white hover:bg-white/20">{course.category}</Badge>
                <Badge className="bg-white/20 text-white hover:bg-white/20">{course.level}</Badge>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">{course.title}</h1>
              <p className="text-emerald-100 mb-4 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-100">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {course.rating}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.studentsCount} طالب</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.lessons?.length ?? 0} درس</span>
              </div>
              <p className="text-emerald-200 mt-3">مدرب الدورة: <span className="font-semibold text-white">{course.instructor}</span></p>
            </div>

            {/* Sidebar Card */}
            <div className="lg:w-80">
              <Card className="bg-white text-gray-900 overflow-hidden">
                {/* Video Preview */}
                <div className="aspect-video bg-gray-900 relative group cursor-pointer">
                  {course.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover opacity-70" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-bl from-gray-800 to-gray-900" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-emerald-600 mr-[-2px]" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="text-3xl font-bold text-emerald-600 mb-4">
                    {course.price === 0 ? 'مجاني' : `${course.price} ر.س`}
                  </div>

                  {isEnrolled ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>التقدم</span>
                        <span>{Math.round(enrollment.progress)}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          const firstLesson = course.lessons[0]
                          if (firstLesson) navigate('lesson', { lessonId: firstLesson.id, courseId: course.id })
                        }}
                      >
                        ابدأ التعلم
                        <ArrowLeft className="w-4 h-4 mr-1" />
                      </Button>
                    </div>
                  ) : (
                    <Dialog open={enrollOpen} onOpenChange={setEnrollOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
                          سجّل الآن
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md" dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="text-right">التسجيل في الدورة</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">الاسم الكامل</Label>
                            <Input id="name" placeholder="أدخل اسمك" value={enrollName} onChange={(e) => setEnrollName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input id="email" type="email" placeholder="example@email.com" value={enrollEmail} onChange={(e) => setEnrollEmail(e.target.value)} dir="ltr" />
                          </div>
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleEnroll} disabled={enrolling}>
                            {enrolling ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <div className="mt-5 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Monitor className="w-4 h-4 text-emerald-600" /> {course.lessons?.length ?? 0} درس تعليمي</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600" /> مدة الدورة: {course.duration}</div>
                    <div className="flex items-center gap-2"><FileQuestion className="w-4 h-4 text-emerald-600" /> {course.quizzes?.length ?? 0} اختبار</div>
                    <div className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-600" /> شهادة إتمام</div>
                    <div className="flex items-center gap-2"><Download className="w-4 h-4 text-emerald-600" /> موارد قابلة للتحميل</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:max-w-3xl">
          <Tabs defaultValue="curriculum" className="w-full">
            <TabsList className="w-full justify-start bg-white border border-gray-200 rounded-xl p-1 h-auto gap-1">
              <TabsTrigger value="overview" className="px-6 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">نظرة عامة
              </TabsTrigger>
              <TabsTrigger value="curriculum" className="px-6 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">المنهج
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="px-6 py-2.5 text-sm font-semibold rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">الاختبارات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">عن هذه الدورة</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{course.description}</p>
                <h4 className="font-semibold mb-3">ماذا ستتعلم</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(course.lessons ?? []).map((lesson) => (
                    <div key={lesson.id} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{lesson.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="curriculum" className="mt-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {(course.lessons ?? []).map((lesson, index) => (
                  <Card
                    key={lesson.id}
                    className={`overflow-hidden transition-all ${
                      lesson.isFree || isEnrolled
                        ? 'cursor-pointer hover:shadow-md'
                        : 'opacity-75'
                    }`}
                    onClick={() => {
                      if (lesson.isFree || isEnrolled) {
                        navigate('lesson', { lessonId: lesson.id, courseId: course.id })
                      } else {
                        toast.error('يرجى التسجيل في الدورة للوصول لهذا الدرس')
                      }
                    }}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{lesson.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{lesson.duration}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {lesson.isFree && (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-200 text-xs">مجاني</Badge>
                        )}
                        {lesson.isFree || isEnrolled ? (
                          <Unlock className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                        <Play className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="quizzes" className="mt-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {(course.quizzes ?? []).map((quiz) => (
                  <Card key={quiz.id} className="overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><FileQuestion className="w-4 h-4" /> {quiz.questions?.length ?? 0} سؤال</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {quiz.timeLimit} دقيقة</span>
                          <span>درجة النجاح: {quiz.passingScore}%</span>
                        </div>
                      </div>
                      {isEnrolled ? (
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => navigate('quiz', { quizId: quiz.id, courseId: course.id })}
                        >
                          ابدأ الاختبار
                          <ArrowLeft className="w-4 h-4 mr-1" />
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => setEnrollOpen(true)}>
                          سجّل للوصول
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
