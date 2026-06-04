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
import PageTransition from '@/components/PageTransition'


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
