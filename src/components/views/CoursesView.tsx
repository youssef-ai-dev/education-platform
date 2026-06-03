'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Star, BookOpen, Clock, Users, Sparkles, GraduationCap, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Course {
  id: string
  title: string
  description: string
  category: string
  thumbnailUrl: string | null
  instructor: string
  duration: string
  rating: number
  studentsCount: number
  price: number
  level: string
}

const CATEGORIES = ['الكل', 'برمجة', 'تصميم', 'أعمال', 'لغات', 'علوم بيانات']
const LEVELS = ['الكل', 'مبتدئ', 'متوسط', 'متقدم']

const LEVEL_COLORS: Record<string, string> = {
  'مبتدئ': 'from-green-400 to-emerald-500',
  'متوسط': 'from-amber-400 to-orange-500',
  'متقدم': 'from-rose-400 to-red-500',
}

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  )
}

function FloatingOrb({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute rounded-full opacity-20 blur-2xl ${className}`} style={style} />
  )
}

export default function CoursesView() {
  const { navigate, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useAppStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedLevel, setSelectedLevel] = useState('الكل')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use static data directly - works on any hosting platform
    try {
      const { getCourses } = require('@/lib/static-data')
      const data = getCourses(
        selectedCategory !== 'الكل' ? selectedCategory : undefined,
        searchQuery || undefined
      )
      setCourses(data)
      setLoading(false)
    } catch {
      // Fallback to API
      const params = new URLSearchParams()
      if (selectedCategory !== 'الكل') params.set('category', selectedCategory)
      if (searchQuery) params.set('search', searchQuery)
      fetch(`/api/courses?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          setCourses(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(() => { setCourses([]); setLoading(false) })
    }
  }, [selectedCategory, searchQuery])

  const filteredCourses = useMemo(() => {
    let filtered = courses
    if (selectedLevel !== 'الكل') {
      filtered = filtered.filter(c => c.level === selectedLevel)
    }
    return filtered
  }, [courses, selectedLevel])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/80">
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Dramatic gradient with multiple color stops */}
        <div className="bg-gradient-to-bl from-emerald-700 via-teal-600 to-emerald-900 text-white">
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Geometric pattern lines */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              white 35px,
              white 36px
            )`
          }} />

          {/* Floating decorative elements */}
          <FloatingOrb className="w-72 h-72 bg-emerald-300 -top-20 -right-20 animate-pulse" />
          <FloatingOrb className="w-48 h-48 bg-teal-200 top-10 left-1/4 animate-pulse" style={{ animationDelay: '1s' }} />
          <FloatingOrb className="w-56 h-56 bg-green-300 -bottom-8 right-1/3 animate-pulse" style={{ animationDelay: '2s' }} />
          <FloatingOrb className="w-32 h-32 bg-cyan-300 top-4 right-1/4 animate-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Sparkle decorations */}
          <motion.div
            className="absolute top-8 right-[15%] text-emerald-200/40"
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-[20%] text-teal-200/30"
            animate={{ rotate: [360, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5" />
          </motion.div>
          <motion.div
            className="absolute top-14 left-[10%] text-green-200/25"
            animate={{ y: [-5, 5, -5], x: [-3, 3, -3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GraduationCap className="w-8 h-8" />
          </motion.div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-12 rounded-full bg-emerald-300/80" />
                <span className="text-emerald-200 text-sm font-medium tracking-wide">منصة علم</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">الدورات التعليمية</h1>
              <p className="text-emerald-100/90 text-lg md:text-xl max-w-xl leading-relaxed">اكتشف أكثر من 50 دورة تعليمية في مختلف المجالات وابدأ رحلتك التعليمية اليوم</p>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave/curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V20C360 0 720 40 1080 20C1260 10 1350 5 1440 0V60H0Z" className="fill-gray-50" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-2">
        {/* Filter bar with glass-morphism */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-white/60 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search with enhanced focus effects */}
            <div className="relative flex-1 w-full group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
              <Input
                placeholder="ابحث عن دورة باسمها أو مدربها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-12 text-base rounded-xl border-gray-200/80 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 focus:shadow-lg focus:shadow-emerald-100/50 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors text-gray-500 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-40 h-12 rounded-xl border-gray-200/80 bg-white/60">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full md:w-36 h-12 rounded-xl border-gray-200/80 bg-white/60">
                  <SelectValue placeholder="المستوى" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(lvl => (
                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category chips with gradient active state */}
          <div className="flex flex-wrap gap-2 mt-5">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden ${
                  selectedCategory === cat
                    ? 'text-white shadow-lg shadow-emerald-300/40'
                    : 'bg-gray-100/80 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-transparent hover:border-emerald-200'
                }`}
              >
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-l from-emerald-500 via-teal-500 to-emerald-600"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results count with badge-like appearance */}
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>عرض {filteredCourses.length} دورة</span>
          </div>
          {(selectedCategory !== 'الكل' || selectedLevel !== 'الكل' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('الكل')
                setSelectedLevel('الكل')
                setSearchQuery('')
              }}
              className="text-sm text-gray-400 hover:text-emerald-600 transition-colors underline underline-offset-2"
            >
              مسح الفلاتر
            </button>
          )}
        </div>

        {/* Loading skeleton with shimmer */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
                <ShimmerBlock className="aspect-video" />
                <div className="p-5 space-y-3">
                  <ShimmerBlock className="h-5 rounded-md w-1/3" />
                  <ShimmerBlock className="h-6 rounded-md w-3/4" />
                  <ShimmerBlock className="h-4 rounded-md w-1/2" />
                  <ShimmerBlock className="h-4 rounded-md w-2/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        <AnimatePresence>
          {!loading && filteredCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
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
        {!loading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 24 }}
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
      </div>

      {/* Global shimmer keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
