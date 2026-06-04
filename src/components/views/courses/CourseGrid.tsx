'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Star, BookOpen, Clock, Users, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Course } from './types'
import { LEVEL_COLORS } from './constants'

interface CourseGridProps {
  filteredCourses: Course[]
}

export default function CourseGrid({ filteredCourses }: CourseGridProps) {
  const { navigate } = useAppStore()

  return (
    <>
      {/* Empty state */}
      <AnimatePresence>
        {filteredCourses.length === 0 && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24"
          >
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-bl from-emerald-50 to-teal-50 border border-emerald-100 mb-6">
              <div className="relative">
                <BookOpen className="w-12 h-12 text-emerald-300" strokeWidth={1.5} />
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-500 text-xs font-bold">?</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد دورات</h3>
            <p className="text-gray-400 max-w-md mx-auto leading-relaxed">جرب البحث بكلمات مختلفة أو تغيير التصنيف لاكتشاف دورات جديدة</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Courses Grid */}
      {filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
            >
              <Card
                className="overflow-hidden cursor-pointer group h-full flex flex-col border border-gray-100/80 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-emerald-200/60 transition-all duration-500 rounded-2xl"
                onClick={() => navigate('course-detail', { courseId: course.id })}
              >
                {/* Thumbnail area */}
                <div className="aspect-video bg-gray-200 overflow-hidden relative">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-bl from-emerald-400 via-teal-400 to-emerald-500 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/40" />
                    </div>
                  )}

                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                  {/* Hover glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Level badge as a ribbon */}
                  <div className="absolute top-0 right-0">
                    <div className={`relative bg-gradient-to-l ${LEVEL_COLORS[course.level] || 'from-emerald-400 to-teal-500'} text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg`}>
                      {course.level}
                      {/* Ribbon fold effect */}
                      <div className="absolute -bottom-1.5 right-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-emerald-900/20" />
                    </div>
                  </div>

                  {/* Free badge */}
                  {course.price === 0 && (
                    <div className="absolute top-0 left-0">
                      <div className="relative bg-gradient-to-l from-amber-400 to-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-br-xl shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        مجاني
                      </div>
                    </div>
                  )}

                  {/* Bottom overlay info */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-xs">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 text-white text-xs">
                        <Users className="w-3 h-3" />
                        {course.studentsCount}
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5 flex flex-col flex-1">
                  <Badge className="mb-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-100 text-xs w-fit font-medium rounded-lg px-2.5">
                    {course.category}
                  </Badge>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-base leading-relaxed flex-1 group-hover:text-emerald-700 transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>

                  {/* Price and action area with divider */}
                  <div className="mt-auto">
                    <div className="h-px bg-gradient-to-l from-transparent via-gray-200 to-transparent mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= Math.round(course.rating)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-200 fill-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {course.price === 0 ? (
                          <span className="font-bold text-amber-600 text-base flex items-center gap-1">
                            <Sparkles className="w-4 h-4" />
                            مجاني
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-600 text-base">{course.price} ر.س</span>
                        )}
                        <Button
                          size="sm"
                          className="bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-sm px-5 py-1.5 rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg hover:shadow-emerald-300/50 transition-all duration-300 font-semibold"
                          onClick={(e) => { e.stopPropagation(); navigate('course-detail', { courseId: course.id }) }}
                        >
                          سجّل الآن
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Global shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  )
}
