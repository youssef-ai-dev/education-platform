'use client'

import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Award, CheckCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Enrollment } from './types'

interface StatsCardsProps {
  enrollments: Enrollment[]
  certificates: any[]
}

export default function StatsCards({ enrollments, certificates }: StatsCardsProps) {
  const completedCourses = enrollments.filter(e => e.progress >= 100)

  const totalHours = enrollments.reduce((acc, e) => {
    const match = e.course.duration.match(/(\d+)/)
    return acc + (match ? parseInt(match[1]) : 0)
  }, 0)

  const stats = [
    { label: 'الدورات المسجلة', value: enrollments.length, icon: BookOpen, gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50' },
    { label: 'الدورات المكتملة', value: completedCourses.length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
    { label: 'الشهادات', value: certificates.length, icon: Award, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
    { label: 'ساعات التعلم', value: totalHours, icon: Clock, gradient: 'from-sky-500 to-cyan-600', bg: 'bg-sky-50' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="group border border-gray-100/80 bg-white shadow-sm hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                  <p className="text-[11px] text-gray-400 font-semibold tracking-wide mt-0.5">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
