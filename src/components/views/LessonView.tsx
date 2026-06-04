'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, FileQuestion, CheckCircle, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { getCourseById } from '@/lib/static-data'

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
  const courseData = useMemo(() => getCourseById(selectedCourseId || '') as any, [selectedCourseId])
  const [course, setCourse] = useState<CourseData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [isMuted, setIsMuted] = useState(false)
  const [showVideo, setShowVideo] = useState(true)
  const [currentVideoId, setCurrentVideoId] = useState('')

  useEffect(() => {
    if (!selectedCourseId || !courseData) return
    setCourse(courseData)
    if (courseData.lessons) {
      const idx = courseData.lessons.findIndex((l: { id: string }) => l.id === selectedLessonId)
      setCurrentVideoId(getVideoId(courseData.category, idx >= 0 ? idx : 0))
    }
  }, [selectedCourseId, selectedLessonId, courseData])

  const currentLesson = course?.lessons.find(l => l.id === selectedLessonId)
  const lessonIndex = course?.lessons.findIndex(l => l.id === selectedLessonId) ?? -1
  const prevLesson = course?.lessons[lessonIndex - 1]
  const nextLesson = course?.lessons[lessonIndex + 1]
  const hasQuiz = course?.quizzes && course.quizzes.length > 0

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/80" dir="rtl">
      {/* Video Player Area */}
      <div className="bg-gray-950 relative">
        <div className="max-w-7xl mx-auto">
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
              /* Simulated Video Player - Cinematic Look */
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center overflow-hidden">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={currentLesson.title} className="w-full h-full object-cover opacity-15" />
                ) : null}
                {/* Cinematic vignette overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
                {/* Subtle film grain texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
                <div className="text-center z-10 px-6">
                  <motion.p
                    className="text-emerald-400/80 text-sm font-medium mb-3 tracking-wide"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    الدرس {lessonIndex + 1}
                  </motion.p>
                  <h3 className="text-white text-xl sm:text-2xl font-bold mb-6 leading-relaxed drop-shadow-lg">{currentLesson.title}</h3>
                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-gray-950"
                    style={{
                      background: isPlaying
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))'
                        : 'linear-gradient(135deg, #059669, #047857)',
                      boxShadow: isPlaying
                        ? '0 0 40px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : '0 0 40px rgba(5,150,105,0.3), 0 8px 32px rgba(5,150,105,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? (
                      <Pause className="w-9 h-9 text-white/90" />
                    ) : (
                      <Play className="w-9 h-9 text-white mr-[-3px]" />
                    )}
                  </motion.button>
                  <p className="text-gray-500 text-xs mt-4">
                    {isPlaying ? 'جاري العرض...' : 'اضغط للتشغيل'}
                  </p>
                </div>
              </div>
            )}

            {/* Video Controls Bar - only for simulated mode */}
            {!showVideo && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-16 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-full bg-white/10 h-1.5 rounded-full mb-4 cursor-pointer backdrop-blur-sm overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-l from-emerald-400 to-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${videoProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="flex items-center justify-between text-white text-sm">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-emerald-400 transition-colors">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="hover:text-emerald-400 transition-colors">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-md backdrop-blur-sm">محاكاة الفيديو</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-300 font-mono">{Math.round(videoProgress)}%</span>
                    <button className="hover:text-emerald-400 transition-colors">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Video Mode - Subtle settings toggle */}
            <div className="absolute top-3 left-3 z-20">
              <Button
                size="sm"
                variant="ghost"
                className="bg-black/30 text-white/70 hover:text-white hover:bg-black/50 backdrop-blur-md text-xs gap-1.5 border border-white/5 h-8 px-3"
                onClick={() => {
                  setShowVideo(!showVideo)
                  setIsPlaying(false)
                  setVideoProgress(0)
                }}
              >
                <Settings className="w-3 h-3" />
                {showVideo ? 'محاكاة' : 'فيديو حقيقي'}
              </Button>
            </div>
          </div>
        </div>

        {/* Gradient border at the bottom of video area */}
        <div className="h-1 bg-gradient-to-l from-emerald-600/0 via-emerald-500 to-emerald-600/0" />
      </div>

      {/* Lesson Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
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

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
                    initial={{ scale: 1.2, opacity: 0 }}
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
              {!completedLessons.has(selectedLessonId) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    className="w-full mb-6 py-6 text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98] border-0"
                    style={{
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      boxShadow: '0 4px 14px rgba(5,150,105,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                    onClick={handleLessonComplete}
                  >
                    <CheckCircle className="w-5 h-5 ml-2" />
                    إكمال الدرس والانتقال للتالي
                  </Button>
                </motion.div>
              )}

              {/* Completed indicator */}
              {completedLessons.has(selectedLessonId) && (
                <motion.div
                  className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0.95 }}
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

          {/* Sidebar - Lesson List */}
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
        </div>
      </div>
    </div>
  )
}
