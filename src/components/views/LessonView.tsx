'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, FileQuestion, CheckCircle, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface CourseData {
  id: string
  title: string
  category: string
  thumbnailUrl: string | null
  lessons: { id: string; title: string; description: string; duration: string; order: number; isFree: boolean }[]
  quizzes: { id: string; title: string }[]
}

// YouTube video IDs for each course category - real educational content
const COURSE_VIDEOS: Record<string, string[]> = {
  'برمجة': ['qz0aGYrrlhU', 'RF5_M7Qz3Tc', 'pEfrdAtAmqk', 'kqtD5dpn9C8', '1Rs2ND1ryYc', 'c9S5niIAois'],
  'تصميم': ['FTjafSZBrE8', '_ygnSguQ_hA', 'Xg0tXgX0kDY', 'GLiJhJxGKPU', 'HZuk6Wkx_Eg'],
  'أعمال': ['j64acUOJYHs', 'Ljx1Z0vY9GM', '9T_YXvX7wAg', 'Nn-Z5vlNx7E', 'M_f16SjEnME'],
  'لغات': ['juKd26Oe0CY', 'H1C9cEr0bYg', 'O4ir7vCqh2k', 'GHeJ9oOEqmc', 'YbhkNcWjBUQ', 'p7CbbBG0DKk'],
  'علوم بيانات': ['LHBE6Q9XlzI', 'xxpcF5CpjCQ', 'uaHGMXM5N28', '4M_Po8XW0p8', 'eMOA1dJgUaI'],
  'default': ['dQw4w9WgXcQ', 'LXb3EKWsInQ', 'jNQXAC9IVRw', '9bZkp7q19f0'],
}

function getVideoId(courseCategory: string, lessonIndex: number): string {
  // Match by category first (more reliable than title matching)
  if (COURSE_VIDEOS[courseCategory]) {
    return COURSE_VIDEOS[courseCategory][lessonIndex % COURSE_VIDEOS[courseCategory].length]
  }
  return COURSE_VIDEOS['default'][lessonIndex % COURSE_VIDEOS['default'].length]
}

export default function LessonView() {
  const { selectedLessonId, selectedCourseId, navigate, studentEmail } = useAppStore()
  const [course, setCourse] = useState<CourseData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [isMuted, setIsMuted] = useState(false)
  const [showVideo, setShowVideo] = useState(true)
  const [currentVideoId, setCurrentVideoId] = useState('')

  const currentLesson = course?.lessons.find(l => l.id === selectedLessonId)
  const lessonIndex = course?.lessons.findIndex(l => l.id === selectedLessonId) ?? -1
  const prevLesson = course?.lessons[lessonIndex - 1]
  const nextLesson = course?.lessons[lessonIndex + 1]
  const hasQuiz = course?.quizzes && course.quizzes.length > 0

  useEffect(() => {
    if (!selectedCourseId) return
    fetch(`/api/courses/${selectedCourseId}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data)
        if (data.lessons) {
          const idx = data.lessons.findIndex((l: { id: string }) => l.id === selectedLessonId)
          setCurrentVideoId(getVideoId(data.category, idx >= 0 ? idx : 0))
        }
      })
      .catch(() => {})
  }, [selectedCourseId, selectedLessonId])

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

  const handleLessonComplete = useCallback(() => {
    if (!selectedLessonId) return
    setCompletedLessons(prev => new Set(prev).add(selectedLessonId))
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
    toast.success('تم إكمال الدرس بنجاح! 🎉')
  }, [selectedLessonId, course?.lessons.length, completedLessons, enrollmentId])

  const simulateVideoProgress = useCallback(() => {
    if (!isPlaying) return
    setVideoProgress(prev => {
      if (prev >= 100) {
        setIsPlaying(false)
        handleLessonComplete()
        return 100
      }
      return prev + 0.5
    })
  }, [isPlaying, handleLessonComplete])

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
            {showVideo && currentVideoId ? (
              /* Real YouTube Video */
              <iframe
                src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1`}
                title={currentLesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              /* Simulated Video Player */
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
            )}

            {/* Video Controls Bar - only for simulated mode */}
            {!showVideo && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-full bg-gray-700 h-1.5 rounded-full mb-3 cursor-pointer">
                  <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                </div>
                <div className="flex items-center justify-between text-white text-sm">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)}>
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-xs text-gray-300">محاكاة الفيديو</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs">{Math.round(videoProgress)}%</span>
                    <Maximize className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Video Mode */}
            <div className="absolute top-3 left-3 z-20">
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm text-xs gap-1.5"
                onClick={() => {
                  setShowVideo(!showVideo)
                  setIsPlaying(false)
                  setVideoProgress(0)
                }}
              >
                <Settings className="w-3.5 h-3.5" />
                {showVideo ? 'محاكاة' : 'فيديو حقيقي'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
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

              {/* Mark as Complete button */}
              {!completedLessons.has(selectedLessonId) && (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 mb-6 py-6 text-base font-semibold"
                  onClick={handleLessonComplete}
                >
                  <CheckCircle className="w-5 h-5 ml-2" />
                  إكمال الدرس والانتقال للتالي
                </Button>
              )}

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
