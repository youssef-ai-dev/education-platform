'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, BookOpen, Star, ArrowLeft, Play, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Course } from './types'
import { levelConfig } from './constants'

export default function FeaturedCourses() {
  const { navigate } = useAppStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const featuredCourses = courses.slice(0, 4)

  return (
    <section className="bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-emerald-200 text-emerald-700 bg-emerald-50/50 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 ml-1.5" />
            الأكثر طلباً
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">الدورات المميزة</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">اختر من بين أفضل الدورات التعليمية المصممة بعناية لتناسب احتياجاتك</p>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="overflow-hidden border-0 shadow-md animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <CardContent className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-3xl border border-gray-100"
          >
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">حدث خطأ أثناء تحميل الدورات</h3>
            <p className="text-gray-400 mb-6">يرجى تحديث الصفحة والمحاولة مرة أخرى</p>
            <Button
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl px-6"
              onClick={() => window.location.reload()}
            >
              إعادة المحاولة
            </Button>
          </motion.div>
        )}

        {/* Courses Grid */}
        {!loading && !error && featuredCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course, i) => {
              const lvl = levelConfig[course.level] || levelConfig['مبتدئ']
              return (
                <motion.div
                  key={course.id}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Card
                    className="overflow-hidden cursor-pointer group border-2 border-transparent shadow-md hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 hover:border-emerald-400/60 transition-all duration-400 rounded-2xl"
                    onClick={() => navigate('course-detail', { courseId: course.id })}
                  >
                    <div className="aspect-video bg-gray-200 overflow-hidden relative">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-bl from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-white/30" />
                        </div>
                      )}
                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                      {/* Level ribbon */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className={`${lvl.bg} text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-md`}>
                          {lvl.label}
                        </div>
                      </div>

                      {/* Play button overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <Badge className="mb-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-[11px] font-semibold border border-emerald-100 rounded-md">{course.category}</Badge>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-[15px] leading-relaxed group-hover:text-emerald-700 transition-colors duration-300">{course.title}</h3>
                      <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {course.instructor}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-bold text-gray-700">{course.rating}</span>
                          <span className="text-xs text-gray-400">({course.studentsCount})</span>
                        </div>
                        <span className="font-black text-emerald-600 text-base">{course.price === 0 ? 'مجاني' : `${course.price} ر.س`}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <motion.div
            initial={false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              className="border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 rounded-xl px-8 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 group"
              onClick={() => navigate('courses')}
            >
              عرض جميع الدورات
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
