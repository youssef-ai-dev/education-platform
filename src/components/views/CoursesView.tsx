'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Star, BookOpen, Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'

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

export default function CoursesView() {
  const { navigate, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useAppStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedLevel, setSelectedLevel] = useState('الكل')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory !== 'الكل') params.set('category', selectedCategory)
    if (searchQuery) params.set('search', searchQuery)

    setLoading(true)
    fetch(`/api/courses?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setCourses(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => { setCourses([]); setLoading(false) })
  }, [selectedCategory, searchQuery])

  const filteredCourses = useMemo(() => {
    let filtered = courses
    if (selectedLevel !== 'الكل') {
      filtered = filtered.filter(c => c.level === selectedLevel)
    }
    return filtered
  }, [courses, selectedLevel])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-bl from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">الدورات التعليمية</h1>
          <p className="text-emerald-100">اكتشف أكثر من 50 دورة تعليمية في مختلف المجالات</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن دورة باسمها أو مدربها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-12 text-base rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-36">
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

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-gray-500">
          عرض {filteredCourses.length} دورة
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">لا توجد دورات</h3>
            <p className="text-gray-400">جرب البحث بكلمات مختلفة أو تغيير التصنيف</p>
          </div>
        )}

        {!loading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group h-full flex flex-col border-0 shadow-md"
                  onClick={() => navigate('course-detail', { courseId: course.id })}
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden relative">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-bl from-emerald-400 to-teal-500 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white/50" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 bg-white/90 text-gray-800 hover:bg-white/90 text-xs font-semibold px-2.5 py-1">
                      {course.level}
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <Badge className="mb-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs w-fit font-medium">{course.category}</Badge>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-base leading-relaxed flex-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{course.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{course.studentsCount} طالب</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600 text-base">{course.price === 0 ? 'مجاني' : `${course.price} ر.س`}</span>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-sm px-4 py-1.5 rounded-lg"
                          onClick={(e) => { e.stopPropagation(); navigate('course-detail', { courseId: course.id }) }}
                        >
                          سجّل الآن
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
