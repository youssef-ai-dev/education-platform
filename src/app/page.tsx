'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HomeView from '@/components/views/HomeView'
import CoursesView from '@/components/views/CoursesView'
import CourseDetailView from '@/components/views/CourseDetailView'
import LessonView from '@/components/views/LessonView'
import QuizView from '@/components/views/QuizView'
import QuizResultView from '@/components/views/QuizResultView'
import DashboardView from '@/components/views/DashboardView'
import CertificateView from '@/components/views/CertificateView'
import PageTransition from '@/components/PageTransition'
import { GraduationCap } from 'lucide-react'

function ViewRenderer() {
  const { currentView } = useAppStore()

  const viewMap: Record<string, React.ReactNode> = {
    'home': <HomeView />,
    'courses': <CoursesView />,
    'course-detail': <CourseDetailView />,
    'lesson': <LessonView />,
    'quiz': <QuizView />,
    'quiz-result': <QuizResultView />,
    'dashboard': <DashboardView />,
    'certificate': <CertificateView />,
  }

  return (
    <PageTransition>
      {viewMap[currentView] || <HomeView />}
    </PageTransition>
  )
}

export default function HomePage() {
  const [seeded, setSeeded] = useState(false)
  const seedingRef = useRef(false)

  useEffect(() => {
    if (seedingRef.current) return
    seedingRef.current = true

    fetch('/api/seed', { method: 'POST' })
      .then(res => res.json())
      .then(() => setSeeded(true))
      .catch(() => setSeeded(true))
  }, [])

  if (!seeded) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <GraduationCap className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-gray-500 font-medium">جاري تحميل المنصة...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <ViewRenderer />
      </main>
      <Footer />
    </div>
  )
}
