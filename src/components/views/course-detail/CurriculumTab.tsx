'use client'

import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Lock, Unlock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { CourseDetail } from './types'

interface CurriculumTabProps {
  course: CourseDetail
  isEnrolled: boolean
  completedLessons: number
  enrollment: { id: string; progress: number } | null
  hoveredLesson: string | null
  onHoveredLessonChange: (id: string | null) => void
}

export default function CurriculumTab({ course, isEnrolled, completedLessons, enrollment, hoveredLesson, onHoveredLessonChange }: CurriculumTabProps) {
  const { navigate } = useAppStore()
  const totalLessons = course.lessons?.length ?? 0

  return (
    <motion.div
      initial={false}
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
            onMouseEnter={() => onHoveredLessonChange(lesson.id)}
            onMouseLeave={() => onHoveredLessonChange(null)}
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
  )
}
