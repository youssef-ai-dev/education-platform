'use client'

import { useEffect, useState } from 'react'
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

function ViewRenderer() {
  const { currentView } = useAppStore()

  switch (currentView) {
    case 'home':
      return <HomeView />
    case 'courses':
      return <CoursesView />
    case 'course-detail':
      return <CourseDetailView />
    case 'lesson':
      return <LessonView />
    case 'quiz':
      return <QuizView />
    case 'quiz-result':
      return <QuizResultView />
    case 'dashboard':
      return <DashboardView />
    case 'certificate':
      return <CertificateView />
    default:
      return <HomeView />
  }
}

export default function HomePage() {
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    // Seed the database on first load
    if (!seeded) {
      fetch('/api/seed', { method: 'POST' })
        .then(res => res.json())
        .then(() => setSeeded(true))
        .catch(() => setSeeded(true))
    }
  }, [seeded])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ViewRenderer />
      </main>
      <Footer />
    </div>
  )
}
