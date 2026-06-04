'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FileQuestion, Clock, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { CourseDetail } from './types'

interface QuizzesTabProps {
  course: CourseDetail
  isEnrolled: boolean
  onEnrollOpenChange: (open: boolean) => void
}

export default function QuizzesTab({ course, isEnrolled, onEnrollOpenChange }: QuizzesTabProps) {
  const { navigate } = useAppStore()

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {(course.quizzes ?? []).map((quiz) => (
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
                    onClick={() => onEnrollOpenChange(true)}
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
  )
}
