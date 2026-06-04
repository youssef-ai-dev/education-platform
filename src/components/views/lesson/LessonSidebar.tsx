'use client'

import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { CourseData } from './types'

interface LessonSidebarProps {
  course: CourseData
  selectedLessonId: string | null
  completedLessons: Set<string>
  enrollmentId: string | null
}

export default function LessonSidebar({
  course,
  selectedLessonId,
  completedLessons,
  enrollmentId,
}: LessonSidebarProps) {
  const { navigate } = useAppStore()

  return (
    <div className="lg:w-84 shrink-0">
      <Card className="sticky top-20 shadow-sm border-gray-100/80 overflow-hidden">
        <CardContent className="p-0">
          {/* Sidebar header */}
          <div className="px-5 pt-5 pb-3">
            <h3 className="font-bold text-gray-900 text-[15px]">محتوى الدورة</h3>
            <p className="text-xs text-gray-500 mt-0.5">{course.lessons.length} دروس</p>
          </div>
          {/* Divider */}
          <div className="h-px bg-gray-100 mx-4" />
          {/* Lesson list with custom scrollbar */}
          <div className="p-3 max-h-[28rem] overflow-y-auto scrollbar-thin">
            <div className="space-y-0.5">
              {course.lessons.map((lesson, index) => {
                const isCurrent = lesson.id === selectedLessonId
                const isCompleted = completedLessons.has(lesson.id)
                return (
                  <motion.button
                    key={lesson.id}
                    onClick={() => {
                      if (lesson.isFree || enrollmentId) {
                        navigate('lesson', { lessonId: lesson.id, courseId: course.id })
                      }
                    }}
                    className={`w-full text-right p-3 rounded-xl text-sm transition-all duration-200 relative ${
                      isCurrent
                        ? 'bg-gradient-to-l from-emerald-50 to-emerald-50/50 border-r-[3px] border-emerald-500 shadow-sm'
                        : isCompleted
                        ? 'hover:bg-emerald-50/30'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Lesson number / completion indicator */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition-all duration-200 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                          : isCurrent
                          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`truncate block ${
                          isCurrent ? 'text-emerald-800 font-semibold' :
                          isCompleted ? 'text-emerald-700 font-medium' :
                          'text-gray-700'
                        }`}>
                          {lesson.title}
                        </span>
                        <span className={`text-xs mt-0.5 block ${
                          isCurrent ? 'text-emerald-500/80' :
                          isCompleted ? 'text-emerald-600/60' :
                          'text-gray-400'
                        }`}>
                          {lesson.duration}
                        </span>
                      </div>
                      {/* Completed checkmark indicator on the side */}
                      {isCompleted && !isCurrent && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
