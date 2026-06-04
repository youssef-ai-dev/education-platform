'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, Users, Clock, Play, BookOpen, Shield, Sparkles, GraduationCap, ArrowRight, ArrowLeft, Monitor, FileQuestion, Award, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { CourseDetail } from './types'

interface CourseHeaderProps {
  course: CourseDetail
  enrollment: { id: string; progress: number } | null
  enrollOpen: boolean
  onEnrollOpenChange: (open: boolean) => void
}

export default function CourseHeader({ course, enrollment, enrollOpen, onEnrollOpenChange }: CourseHeaderProps) {
  const { navigate } = useAppStore()
  const isEnrolled = !!enrollment
  const totalLessons = course.lessons?.length ?? 0
  const completedLessons = isEnrolled ? Math.round((enrollment.progress / 100) * totalLessons) : 0

  return (
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
          initial={false}
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
            initial={false}
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
            initial={false}
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
                  <Button
                    className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-base py-6 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
                    onClick={() => onEnrollOpenChange(true)}
                  >
                    <Sparkles className="w-4 h-4 ml-2" />
                    سجّل الآن
                  </Button>
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
  )
}
