'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Enrollment } from './types'
import { COLORS, weeklyData } from './constants'

interface ChartsSectionProps {
  enrollments: Enrollment[]
}

export default function ChartsSection({ enrollments }: ChartsSectionProps) {
  const progressData = enrollments.map(e => ({
    name: e.course.title.length > 15 ? e.course.title.substring(0, 15) + '...' : e.course.title,
    progress: Math.round(e.progress),
    fullTitle: e.course.title,
  }))

  const categoryData = enrollments.reduce((acc: { name: string; value: number }[], e) => {
    const cat = e.course.category
    const existing = acc.find(a => a.name === cat)
    if (existing) existing.value += 1
    else acc.push({ name: cat, value: 1 })
    return acc
  }, [])

  if (enrollments.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Progress Bar Chart */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="lg:col-span-2 border border-gray-100/80 bg-white shadow-sm overflow-hidden h-full">
            <div className="p-5 pb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">تقدم الدورات</h3>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold px-2.5">
                  <TrendingUp className="w-3 h-3 ml-1" />
                  {enrollments.length} دورة
                </Badge>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="h-64 bg-gray-50/50 rounded-xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'التقدم']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '13px' }}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="progress" fill="url(#barGradient)" radius={[0, 6, 6, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border border-gray-100/80 bg-white shadow-sm overflow-hidden h-full">
            <div className="p-5 pb-0">
              <h3 className="font-bold text-gray-900 text-lg mb-4">التخصصات</h3>
            </div>
            <div className="px-5 pb-5">
              <div className="h-64 bg-gray-50/50 rounded-xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '13px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Activity */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="border border-gray-100/80 bg-white shadow-sm overflow-hidden mb-8">
          <div className="p-5 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">النشاط الأسبوعي</h3>
              <Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-semibold px-2.5">
                <Flame className="w-3 h-3 ml-1" />
                {weeklyData.reduce((a, d) => a + d.hours, 0).toFixed(1)} ساعة هذا الأسبوع
              </Badge>
            </div>
          </div>
          <div className="px-5 pb-5">
            <div className="h-48 bg-gray-50/50 rounded-xl p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: number) => [`${value} ساعة`, 'وقت التعلم']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: '13px' }}
                  />
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="hours" stroke="#059669" strokeWidth={2.5} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  )
}
