'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle, FileQuestion } from 'lucide-react'
import { motion } from 'framer-motion'
import { CourseData } from './types'

interface LessonContentProps {
  course: CourseData
  currentLesson: { id: string; title: string; description: string; duration: string; order: number; isFree: boolean }
  lessonIndex: number
  progress: number
  completedLessons: Set<string>
  selectedLessonId: string | null
  onLessonComplete: () => void
}

export default function LessonContent({
  course,
  currentLesson,
  lessonIndex,
  progress,
  completedLessons,
  selectedLessonId,
  onLessonComplete,
}: LessonContentProps) {
  const { navigate } = useAppStore()
  const prevLesson = course.lessons[lessonIndex - 1]
  const nextLesson = course.lessons[lessonIndex + 1]
  const hasQuiz = course.quizzes && course.quizzes.length > 0

  return (
    <div className="flex-1 min-w-0">
      {/* Back Button - Improved styling */}
      <motion.button
        onClick={() => navigate('course-detail', { courseId: course.id })}
        className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors duration-200"
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors duration-200">
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
        <span>العودة للدورة: <span className="font-medium">{course.title}</span></span>
      </motion.button>

      <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{currentLesson.title}</h1>
        <p className="text-gray-600 mb-8 leading-relaxed text-[15px]">{currentLesson.description}</p>

        {/* Course Progress - Gradient accent card */}
        <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 mb-6 overflow-hidden">
          {/* Gradient accent strip on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-r-full" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">تقدم الدورة</span>
            <motion.span
              key={progress}
              className="text-sm text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full"
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {progress}%
            </motion.span>
          </div>
          <Progress value={progress} className="h-2.5" />
          <p className="text-xs text-gray-500 mt-3">
            <span className="font-medium text-emerald-600">{completedLessons.size}</span> من <span className="font-medium">{course.lessons.length}</span> درس مكتمل
          </p>
        </div>

        {/* Mark as Complete button - Gradient and shadow */}
        {!completedLessons.has(selectedLessonId || '') && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              className="w-full mb-6 py-6 text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] border-0"
              style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                boxShadow: '0 4px 14px rgba(5,150,105,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
              onClick={onLessonComplete}
            >
              <CheckCircle className="w-5 h-5 ml-2" />
              إكمال الدرس والانتقال للتالي
            </Button>
          </motion.div>
        )}

        {/* Completed indicator */}
        {completedLessons.has(selectedLessonId || '') && (
          <motion.div
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3"
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-emerald-700 font-semibold text-sm">تم إكمال هذا الدرس</p>
              <p className="text-emerald-600/70 text-xs">يمكنك مراجعة المحتوى أو الانتقال للدرس التالي</p>
            </div>
          </motion.div>
        )}

        {/* Navigation - Premium styling */}
        <div className="flex items-center justify-between gap-3">
          {prevLesson ? (
            <Button
              variant="outline"
              className="rounded-xl px-5 py-2.5 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]"
              onClick={() => navigate('lesson', { lessonId: prevLesson.id, courseId: course.id })}
            >
              <ArrowRight className="w-4 h-4 ml-1.5" />
              الدرس السابق
            </Button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Button
              className="rounded-xl px-5 py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] border-0"
              style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                boxShadow: '0 2px 10px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
              onClick={() => navigate('lesson', { lessonId: nextLesson.id, courseId: course.id })}
            >
              الدرس التالي
              <ArrowLeft className="w-4 h-4 mr-1.5" />
            </Button>
          ) : hasQuiz ? (
            <Button
              className="rounded-xl px-5 py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-amber-600/20 active:scale-[0.98] border-0"
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                boxShadow: '0 2px 10px rgba(217,119,6,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
              onClick={() => navigate('quiz', { quizId: course.quizzes[0].id, courseId: course.id })}
            >
              انتقل للاختبار
              <FileQuestion className="w-4 h-4 mr-1.5" />
            </Button>
          ) : (
            <Button
              className="rounded-xl px-5 py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] border-0"
              style={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                boxShadow: '0 2px 10px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
              onClick={() => navigate('dashboard')}
            >
              العودة للوحة التحكم
              <CheckCircle className="w-4 h-4 mr-1.5" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
