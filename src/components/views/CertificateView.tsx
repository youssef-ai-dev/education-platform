'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { ArrowRight, Printer, Award, GraduationCap, Sparkles, Shield, BookOpen } from 'lucide-react'
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Award className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">جاري تحميل الشهادة...</p>
        </motion.div>
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-emerald-50/20 flex items-center justify-center">
        <p className="text-gray-500 font-medium">الشهادة غير موجودة</p>
      </div>
    )
  }

  const completedDate = new Date(certificate.completedAt).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-emerald-50/30 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={() => navigate('dashboard')}
              className="border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl font-semibold transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة للوحة التحكم
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className="bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-200 rounded-xl font-semibold transition-all duration-300"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4 ml-2" />
              طباعة الشهادة
            </Button>
          </motion.div>
        </div>

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-white shadow-2xl shadow-gray-300/40 rounded-2xl overflow-hidden border-0 print:shadow-none print:rounded-none">
            {/* Outer decorative border */}
            <div className="m-2 sm:m-3">
              <div className="relative border-[3px] border-amber-300/80 rounded-xl p-1 overflow-hidden">
                {/* Subtle watermark pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 20px,
                    #059669 20px,
                    #059669 21px
                  )`
                }} />

                {/* Inner decorative border */}
                <div className="relative border border-dashed border-amber-300/60 rounded-lg p-6 sm:p-8 md:p-12 text-center">
                  {/* Corner decorations */}
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400/60 rounded-tr-lg" />
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400/60 rounded-tl-lg" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400/60 rounded-br-lg" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400/60 rounded-bl-lg" />

                  {/* Decorative top */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px flex-1 bg-gradient-to-l from-amber-400/80 to-transparent" />
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    >
                      <GraduationCap className="w-10 h-10 text-emerald-600" />
                    </motion.div>
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-400/80 to-transparent" />
                  </div>

                  {/* Logo */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-2 mb-2"
                  >
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-2 rounded-xl shadow-md shadow-emerald-200">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-emerald-700">علم</span>
                  </motion.div>
                  <p className="text-xs text-gray-400 font-medium tracking-wider mb-6">منصة التعلم الإلكتروني</p>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-3xl md:text-4xl font-black text-gray-900 mb-1"
                  >
                    شهادة إتمام
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-gray-400 text-sm font-semibold tracking-[0.2em] uppercase mb-8"
                  >
                    Certificate of Completion
                  </motion.p>

                  {/* Decorative line */}
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-200" />
                    <div className="h-px w-24 bg-gradient-to-l from-emerald-400/60 to-transparent" />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.9, type: 'spring' }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-md shadow-amber-200">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                    <div className="h-px w-24 bg-gradient-to-r from-emerald-400/60 to-transparent" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-200" />
                  </div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <p className="text-gray-500 mb-2 text-sm">نشهد بأن</p>
                    <h2 className="text-2xl md:text-3xl font-black text-emerald-700 mb-4 py-2 border-b-2 border-t-2 border-emerald-100 inline-block px-6">
                      {certificate.studentName}
                    </h2>
                    <br />
                    <p className="text-gray-500 mb-2 text-sm mt-4">قد أتم بنجاح دورة</p>
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6">
                      {certificate.courseTitle}
                    </h3>
                    <p className="text-gray-500 mb-10 text-sm">
                      تحت إشراف المدرب: <span className="font-bold text-gray-700">{certificate.instructor}</span>
                    </p>
                  </motion.div>

                  {/* Date and ID Section */}
                  <div className="flex items-start justify-center gap-10 text-sm mb-10">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        <p className="font-bold text-gray-700 text-xs">تاريخ الإتمام</p>
                      </div>
                      <p className="text-gray-500 font-medium">{completedDate}</p>
                    </div>
                    <div className="w-px h-10 bg-gray-200" />
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <p className="font-bold text-gray-700 text-xs">رقم الشهادة</p>
                      </div>
                      <p dir="ltr" className="text-gray-500 font-mono font-medium">{certificate.certificateId}</p>
                    </div>
                  </div>

                  {/* Bottom decorative */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-l from-amber-400/50 to-transparent" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-amber-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-400/50 to-transparent" />
                  </div>

                  {/* Platform footer */}
                  <p className="mt-4 text-[10px] text-gray-300 font-medium tracking-wider">
                    صادر من منصة علم — منصة التعلم الإلكتروني المعتمدة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
