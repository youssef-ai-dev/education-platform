'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Play, FileQuestion } from 'lucide-react'
import { motion } from 'framer-motion'
import { Enrollment } from './types'

interface EnrolledCoursesProps {
  enrollments: Enrollment[]
  loading: boolean
}

export default function EnrolledCourses({ enrollments, loading }: EnrolledCoursesProps) {
  const { navigate } = useAppStore()

  return (
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
              initial={false}
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
  )
}
