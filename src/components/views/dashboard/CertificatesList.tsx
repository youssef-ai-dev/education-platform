'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface CertificatesListProps {
  certificates: any[]
}

export default function CertificatesList({ certificates }: CertificatesListProps) {
  const { navigate } = useAppStore()

  if (certificates.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">شهاداتي</h2>
        <Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold">
          {certificates.length} شهادة
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="group overflow-hidden border border-amber-200/60 bg-gradient-to-bl from-amber-50/80 via-white to-orange-50/50 shadow-sm hover:shadow-lg hover:shadow-amber-900/5 transition-all duration-300 hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{cert.courseTitle}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">رقم الشهادة: {cert.certificateId}</p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-xs rounded-lg shadow-sm shadow-amber-500/20 transition-all duration-200 text-white"
                    onClick={() => navigate('certificate', { certificateId: cert.certificateId })}
                  >
                    عرض
                    <ArrowLeft className="w-3 h-3 mr-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
