'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Enrollment } from './types'
import DashboardLogin from './DashboardLogin'
import DashboardHeader from './DashboardHeader'
import StatsCards from './StatsCards'
import ChartsSection from './ChartsSection'
import EnrolledCourses from './EnrolledCourses'
import CertificatesList from './CertificatesList'
import AccountSwitchDialog from './AccountSwitchDialog'

export default function DashboardView() {
  const { studentEmail, studentName, setStudentInfo } = useAppStore()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)

  const fetchEnrollments = async (email: string) => {
    try {
      const [enrollRes, certRes] = await Promise.all([
        fetch(`/api/enrollments?email=${encodeURIComponent(email)}`),
        fetch(`/api/certificates?email=${encodeURIComponent(email)}`)
      ])
      const enrollData = await enrollRes.json()
      const certData = await certRes.json()
      setEnrollments(Array.isArray(enrollData) ? enrollData : [])
      setCertificates(Array.isArray(certData) ? certData : [])
      setLoading(false)
    } catch {
      setEnrollments([])
      setCertificates([])
      setLoading(false)
    }
  }

  useEffect(() => {
    if (studentEmail) {
      setLoading(false)
      try {
        Promise.all([
          fetch(`/api/enrollments?email=${encodeURIComponent(studentEmail)}`).then(r => r.json()).catch(() => []),
          fetch(`/api/certificates?email=${encodeURIComponent(studentEmail)}`).then(r => r.json()).catch(() => [])
        ]).then(([enrollData, certData]) => {
          setEnrollments(Array.isArray(enrollData) ? enrollData : [])
          setCertificates(Array.isArray(certData) ? certData : [])
        })
      } catch {
        setEnrollments([])
        setCertificates([])
      }
    }
  }, [studentEmail])

  const handleLogin = (name: string, email: string) => {
    setStudentInfo(name, email)
    setLoginOpen(false)
    fetchEnrollments(email)
  }

  if (!studentEmail) {
    return <DashboardLogin onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 relative">
      <DashboardHeader onSwitchAccount={() => setLoginOpen(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pb-12">
        <StatsCards enrollments={enrollments} certificates={certificates} />
        <ChartsSection enrollments={enrollments} />
        <EnrolledCourses enrollments={enrollments} loading={loading} />
        <CertificatesList certificates={certificates} />
      </div>

      <AccountSwitchDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onLogin={handleLogin}
      />
    </div>
  )
}
