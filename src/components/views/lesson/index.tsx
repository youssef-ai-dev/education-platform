'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { motion } from 'framer-motion'
import { CourseData, getVideoId } from './types'
import VideoPlayer from './VideoPlayer'
import LessonContent from './LessonContent'
import LessonSidebar from './LessonSidebar'

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

  useEffect(() => {
    if (!selectedCourseId) return
    fetch(`/api/courses/${selectedCourseId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(data => {
        setCourse(data)
        if (data.lessons) {
          const idx = data.lessons.findIndex((l: { id: string }) => l.id === selectedLessonId)
          setCurrentVideoId(getVideoId(data.category, idx >= 0 ? idx : 0))
        }
      })
      .catch(() => setCourse(null))
  }, [selectedCourseId, selectedLessonId])

  const currentLesson = course?.lessons.find(l => l.id === selectedLessonId)
  const lessonIndex = course?.lessons.findIndex(l => l.id === selectedLessonId) ?? -1

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
      <VideoPlayer
        course={course}
        currentLesson={currentLesson}
        lessonIndex={lessonIndex}
        isPlaying={isPlaying}
        isMuted={isMuted}
        videoProgress={videoProgress}
        showVideo={showVideo}
        currentVideoId={currentVideoId}
        onPlayToggle={() => setIsPlaying(!isPlaying)}
        onMuteToggle={() => setIsMuted(!isMuted)}
        onVideoModeToggle={() => {
          setShowVideo(!showVideo)
          setIsPlaying(false)
          setVideoProgress(0)
        }}
      />

      {/* Lesson Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <LessonContent
            course={course}
            currentLesson={currentLesson}
            lessonIndex={lessonIndex}
            progress={progress}
            completedLessons={completedLessons}
            selectedLessonId={selectedLessonId}
            onLessonComplete={handleLessonComplete}
          />
          <LessonSidebar
            course={course}
            selectedLessonId={selectedLessonId}
            completedLessons={completedLessons}
            enrollmentId={enrollmentId}
          />
        </div>
      </div>
    </div>
  )
}
