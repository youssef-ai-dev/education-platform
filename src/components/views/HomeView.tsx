'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Users, BookOpen, Award, Star, ArrowLeft, Code, Palette, Briefcase, Globe, BarChart3, Play, Sparkles, CheckCircle } from 'lucide-react'
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

export default function HomeView() {
  const { navigate } = useAppStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const fetchAttempted = useRef(false)

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true)
      setError(false)
      const res = await fetch('/api/courses')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      if (Array.isArray(data)) {
        setCourses(data)
      } else {
        setCourses([])
      }
      setLoading(false)
    } catch {
      setCourses([])
      setError(true)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!fetchAttempted.current) {
      fetchAttempted.current = true
      loadCourses()
    }
  }, [loadCourses])

  const categories = [
    { name: 'برمجة', icon: Code, color: 'bg-emerald-100 text-emerald-700', count: '20+ دورة' },
    { name: 'تصميم', icon: Palette, color: 'bg-purple-100 text-purple-700', count: '15+ دورة' },
    { name: 'أعمال', icon: Briefcase, color: 'bg-amber-100 text-amber-700', count: '10+ دورة' },
    { name: 'لغات', icon: Globe, color: 'bg-sky-100 text-sky-700', count: '8+ دورة' },
    { name: 'علوم بيانات', icon: BarChart3, color: 'bg-rose-100 text-rose-700', count: '12+ دورة' },
  ]

  const stats = [
    { label: 'طالب نشط', value: '500+', icon: Users },
    { label: 'دورة تعليمية', value: '50+', icon: BookOpen },
    { label: 'مدرب محترف', value: '20+', icon: GraduationCap },
    { label: 'شهادة صادرة', value: '1000+', icon: Award },
  ]

  const testimonials = [
    { name: 'محمد أحمد', role: 'مطور ويب', text: 'تغيّرت مسيرتي المهنية بالكامل بعد إتمام دورة تطوير الويب. المحتوى عالي الجودة والمدربون رائعون!' },
    { name: 'سارة خالد', role: 'مصممة واجهات', text: 'أفضل منصة تعليمية عربية. الدورات منظمة بشكل ممتاز والشهادات معتمدة ومفيدة في سوق العمل.' },
    { name: 'عبدالله سعيد', role: 'محلل بيانات', text: 'تعلمت تحليل البيانات من الصفر وحصلت على وظيفة أحلامي. شكراً لمنصة علم!' },
  ]

  const featuredCourses = courses.slice(0, 4)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-600 via-emerald-700 to-teal-800 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 py-16 md:py-24">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-right"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                منصة تعليمية عربية رائدة
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                تعلّم بلا حدود
                <br />
                <span className="text-emerald-200">مع أفضل المدربين</span>
              </h1>

              <p className="text-lg md:text-xl text-emerald-100 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                اكتشف عالماً من المعرفة مع أفضل المدربين العرب. دورات تفاعلية، شهادات معتمدة، وتعلم ذاتي المعدل يناسب وقتك.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 rounded-xl font-bold shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:shadow-emerald-900/40 transition-all"
                  onClick={() => navigate('courses')}
                >
                  استكشف الدورات
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
                <Button
                  size="lg"
                  className="bg-emerald-500/30 text-white hover:bg-emerald-500/50 backdrop-blur-sm border border-white/20 text-lg px-8 py-6 rounded-xl font-semibold transition-all"
                  onClick={() => navigate('dashboard')}
                >
                  <Play className="w-5 h-5 ml-2" />
                  جرّبه مجاناً
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  شهادات معتمدة
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  +50 دورة تعليمية
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  دعم متواصل
                </span>
              </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 max-w-lg w-full"
            >
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/40 border border-white/10">
                  <img
                    src="/hero-illustration.png"
                    alt="منصة علم - تعلّم بلا حدود"
                    className="w-full h-auto"
                  />
                </div>
                {/* Floating badge 1 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">شهادة</p>
                    <p className="text-sm font-bold text-gray-900">معتمدة</p>
                  </div>
                </motion.div>
                {/* Floating badge 2 */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">طلاب نشطون</p>
                    <p className="text-sm font-bold text-gray-900">500+</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-1 bg-gradient-to-b from-teal-800 to-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 -mt-12 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.5, duration: 0.4 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      <stat.icon className="w-7 h-7 text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">الدورات المميزة</h2>
            <p className="text-gray-600">اختر من بين أفضل الدورات التعليمية</p>
          </div>

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
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">حدث خطأ أثناء تحميل الدورات</h3>
              <p className="text-gray-400 mb-4">يرجى تحديث الصفحة والمحاولة مرة أخرى</p>
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={loadCourses}
              >
                إعادة المحاولة
              </Button>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && featuredCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course, i) => (
                  <Card
                    key={course.id}
                    className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group border-0 shadow-md"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-5">
                      <Badge className="mb-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs font-medium">{course.category}</Badge>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-base leading-relaxed">{course.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{course.instructor}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
                          <span className="text-xs text-gray-400">({course.studentsCount})</span>
                        </div>
                        <span className="font-bold text-emerald-600 text-base">{course.price === 0 ? 'مجاني' : `${course.price} ر.س`}</span>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                onClick={() => navigate('courses')}
              >
                عرض جميع الدورات
                <ArrowLeft className="w-4 h-4 mr-1" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">تصفح حسب التصنيف</h2>
            <p className="text-gray-600">اختر المجال الذي يناسب اهتماماتك</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-all duration-300 text-center p-6 group"
                  onClick={() => navigate('courses')}
                >
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.count}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">ماذا يقول طلابنا</h2>
            <p className="text-gray-600 text-lg">تجارب حقيقية من طلاب استفادوا من منصتنا</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                <Card className="p-6 h-full border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-5 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-bl from-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلة التعلم اليوم</h2>
          <p className="text-emerald-100 mb-8 text-lg">انضم إلى آلاف الطلاب الذين يطورون مهاراتهم يومياً</p>
          <Button
            size="lg"
            className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-10 py-6 rounded-xl font-semibold transition-all"
            onClick={() => navigate('courses')}
          >
            سجّل الآن مجاناً
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
