'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { CourseDetail } from './types'
import CourseHeader from './CourseHeader'
import EnrollDialog from './EnrollDialog'
import OverviewTab from './OverviewTab'
import CurriculumTab from './CurriculumTab'
import QuizzesTab from './QuizzesTab'

export default function CourseDetailView() {
  const { selectedCourseId, navigate, studentEmail } = useAppStore()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrollOpen, setEnrollOpen] = useState(false)
  const [hoveredLesson, setHoveredLesson] = useState<string | null>(null)
  const [enrollmentOverride, setEnrollmentOverride] = useState<{ id: string; progress: number } | null>(null)
  const prevCourseIdRef = useRef<string | null>(null)

  const fetchCourse = useCallback(() => {
    if (!selectedCourseId) return
    fetch(`/api/courses/${selectedCourseId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setCourse(data)
        setLoading(false)
      })
      .catch(() => {
        setCourse(null)
        setLoading(false)
      })
  }, [selectedCourseId])

  useEffect(() => {
    if (prevCourseIdRef.current !== selectedCourseId) {
      prevCourseIdRef.current = selectedCourseId
      setLoading(true)
    }
    fetchCourse()
  }, [fetchCourse])

  const enrollmentFromData = useMemo(() => {
    if (!course || !studentEmail) return null
    const existing = course.enrollments?.find((e: { studentEmail: string }) => e.studentEmail === studentEmail)
    return existing ? { id: existing.id, progress: existing.progress } : null
  }, [course, studentEmail])

  const enrollment = enrollmentOverride ?? enrollmentFromData

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
      <CourseHeader
        course={course}
        enrollment={enrollment}
        enrollOpen={enrollOpen}
        onEnrollOpenChange={setEnrollOpen}
      />

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
              <OverviewTab course={course} />
            </TabsContent>

            {/* Curriculum Tab */}
            <TabsContent value="curriculum" className="mt-6">
              <CurriculumTab
                course={course}
                isEnrolled={isEnrolled}
                completedLessons={completedLessons}
                enrollment={enrollment}
                hoveredLesson={hoveredLesson}
                onHoveredLessonChange={setHoveredLesson}
              />
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="mt-6">
              <QuizzesTab
                course={course}
                isEnrolled={isEnrolled}
                onEnrollOpenChange={setEnrollOpen}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Enroll Dialog */}
      <EnrollDialog
        course={course}
        open={enrollOpen}
        onOpenChange={setEnrollOpen}
        onEnrolled={(newEnrollment) => setEnrollmentOverride(newEnrollment)}
      />
    </div>
  )
}
