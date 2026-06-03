'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, Play, Pause, Volume2, Maximize, FileQuestion, CheckCircle, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface CourseData {
  id: string
  title: string
  lessons: { id: string; title: string; description: string; duration: string; order: number; isFree: boolean }[]
  quizzes: { id: string; title: string }[]
}

export default function LessonView() {
  const { selectedLessonId, selectedCourseId, navigate, studentEmail } = useAppStore()
  const [course, setCourse] = useState<CourseData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())

  const currentLesson = course?.lessons.find(l => l.id === selectedLessonId)
  const lessonIndex = course?.lessons.findIndex(l => l.id === selectedLessonId) ?? -1
  const prevLesson = course?.lessons[lessonIndex - 1]
  const nextLesson = course?.lessons[lessonIndex + 1]
  const hasQuiz = course?.quizzes && course.quizzes.length > 0

  useEffect(() => {
    if (!selectedCourseId) return
    fetch(`/api/courses/${selectedCourseId}`)
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(() => {})
  }, [selectedCourseId])

  useEffect(() => {
    if (!studentEmail || !selectedCourseId) return
    fetch(`/api/enrollments?email=${encodeURIComponent(studentEmail)}`)
      .then(res => res.json())
      .then(data => {
        const enroll = data.find((e: { courseId: string }) => e.courseId === selectedCourseId)
        if (enroll) {
          setEnrollmentId(enroll.id)
          setProgress(enroll.progress)
        }
      })
      .catch(() => {})
  }, [studentEmail, selectedCourseId])

  const simulateVideoProgress = useCallback(() => {
    if (!isPlaying) return
    setVideoProgress(prev => {
      if (prev >= 100) {
        setIsPlaying(false)
        if (selectedLessonId) {
          setCompletedLessons(prev => new Set(prev).add(selectedLessonId))
          // Update course progress
          const totalLessons = course?.lessons.length ?? 1
          const newCompleted = new Set(completedLessons).add(selectedLessonId)
          const newProgress = Math.round((newCompleted.size / totalLessons) * 100)
          setProgress(newProgress)
          if (enrollmentId) {
            fetch(`/api/enrollments/${enrollmentId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ progress: newProgress })
            }).catch(() => {})
          }
          toast.success('تم إكمال الدرس!')
        }
        return 100
      }
      return prev + 0.5
    })
  }, [isPlaying, selectedLessonId, course?.lessons.length, completedLessons, enrollmentId])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(simulateVideoProgress, 100)
    return () => clearInterval(interval)
  }, [isPlaying, simulateVideoProgress])

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Video Player Area */}
      <div className="bg-gray-900 relative">
        <div className="max-w-6xl mx-auto">
          <div className="aspect-video relative group">
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-bl from-gray-800 to-gray-900 flex items-center justify-center">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={currentLesson.title} className="w-full h-full object-cover opacity-30" />
              ) : null}
              <div className="text-center z-10">
                <h3 className="text-white text-xl mb-4">{currentLesson.title}</h3>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center transition-all hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 text-white mr-[-3px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 h-1 rounded-full mb-3 cursor-pointer">
                <div className="bg-emerald-500 h-1 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
              </div>
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <Volume2 className="w-5 h-5" />
                  <span className="text-xs text-gray-300">محاكاة الفيديو</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs">{Math.round(videoProgress)}%</span>
                  <Maximize className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <button
              onClick={() => navigate('course-detail', { courseId: course.id })}
              className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 mb-4"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للدورة: {course.title}
            </button>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">{currentLesson.description}</p>

              {/* Course Progress */}
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">تقدم الدورة</span>
                  <span className="text-sm text-emerald-600 font-semibold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">
                  {completedLessons.size} من {course.lessons.length} درس مكتمل
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                {prevLesson ? (
                  <Button
                    variant="outline"
                    onClick={() => navigate('lesson', { lessonId: prevLesson.id, courseId: course.id })}
                  >
                    <ArrowRight className="w-4 h-4 ml-1" />
                    الدرس السابق
                  </Button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => navigate('lesson', { lessonId: nextLesson.id, courseId: course.id })}
                  >
                    الدرس التالي
                    <ArrowLeft className="w-4 h-4 mr-1" />
                  </Button>
                ) : hasQuiz ? (
                  <Button
                    className="bg-amber-600 hover:bg-amber-700"
                    onClick={() => navigate('quiz', { quizId: course.quizzes[0].id, courseId: course.id })}
                  >
                    انتقل للاختبار
                    <FileQuestion className="w-4 h-4 mr-1" />
                  </Button>
                ) : (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => navigate('dashboard')}
                  >
                    العودة للوحة التحكم
                    <CheckCircle className="w-4 h-4 mr-1" />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Lesson List */}
          <div className="lg:w-80 shrink-0">
            <Card className="sticky top-20">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">محتوى الدورة</h3>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {course.lessons.map((lesson, index) => {
                    const isCurrent = lesson.id === selectedLessonId
                    const isCompleted = completedLessons.has(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          if (lesson.isFree || enrollmentId) {
                            navigate('lesson', { lessonId: lesson.id, courseId: course.id })
                          }
                        }}
                        className={`w-full text-right p-3 rounded-lg text-sm transition-colors ${
                          isCurrent ? 'bg-emerald-50 text-emerald-700 font-medium' :
                          isCompleted ? 'bg-green-50 text-green-700' :
                          'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                            isCompleted ? 'bg-emerald-600 text-white' :
                            isCurrent ? 'bg-emerald-100 text-emerald-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : index + 1}
                          </div>
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 mr-8">{lesson.duration}</p>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
