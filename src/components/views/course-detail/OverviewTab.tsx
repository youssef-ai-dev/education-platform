'use client'

import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { CourseDetail } from './types'

interface OverviewTabProps {
  course: CourseDetail
}

export default function OverviewTab({ course }: OverviewTabProps) {
  return (
    <motion.div
      initial={false}
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
            initial={false}
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
  )
}
