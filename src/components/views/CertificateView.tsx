'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { ArrowRight, Printer, Award, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

interface CertificateData {
  id: string
  studentName: string
  courseTitle: string
  instructor: string
  completedAt: string
  certificateId: string
}

export default function CertificateView() {
  const { certificateId, navigate } = useAppStore()
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!certificateId) return
    fetch(`/api/certificates/${certificateId}`)
      .then(res => res.json())
      .then(data => {
        setCertificate(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [certificateId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">جاري تحميل الشهادة...</p>
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">الشهادة غير موجودة</p>
      </div>
    )
  }

  const completedDate = new Date(certificate.completedAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button
            variant="outline"
            onClick={() => navigate('dashboard')}
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            العودة للوحة التحكم
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 ml-1" />
            طباعة الشهادة
          </Button>
        </div>

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden border-4 border-amber-300 print:shadow-none print:border-2">
            {/* Outer decorative border */}
            <div className="m-3 border-2 border-amber-200 rounded-lg p-1">
              <div className="border border-dashed border-amber-300 rounded-lg p-8 md:p-12 text-center">
                {/* Decorative top */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-l from-amber-400 to-transparent" />
                  <GraduationCap className="w-10 h-10 text-emerald-600" />
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-400 to-transparent" />
                </div>

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-emerald-700">علم</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 mt-4">
                  شهادة إتمام
                </h1>
                <p className="text-gray-500 mb-8">Certificate of Completion</p>

                {/* Decorative line */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="h-px w-32 bg-gradient-to-l from-emerald-400 to-transparent" />
                  <Award className="w-6 h-6 text-amber-500" />
                  <div className="h-px w-32 bg-gradient-to-r from-emerald-400 to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>

                {/* Content */}
                <p className="text-gray-600 mb-2">نشهد بأن</p>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-4">
                  {certificate.studentName}
                </h2>
                <p className="text-gray-600 mb-2">قد أتم بنجاح دورة</p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  {certificate.courseTitle}
                </h3>
                <p className="text-gray-600 mb-8">
                  تحت إشراف المدرب: <span className="font-semibold">{certificate.instructor}</span>
                </p>

                {/* Date and ID */}
                <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-8">
                  <div>
                    <p className="font-medium text-gray-700">تاريخ الإتمام</p>
                    <p>{completedDate}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">رقم الشهادة</p>
                    <p dir="ltr" className="font-mono">{certificate.certificateId}</p>
                  </div>
                </div>

                {/* Bottom decorative */}
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-l from-amber-400 to-transparent" />
                  <div className="w-3 h-3 rounded-full border-2 border-amber-400" />
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-400 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
