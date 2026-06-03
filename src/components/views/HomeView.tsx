'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Users, BookOpen, Award, Star, ArrowLeft, Code, Palette, Briefcase, Globe, BarChart3, Play, Sparkles, CheckCircle, Quote, Zap, TrendingUp, Clock } from 'lucide-react'
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

const levelConfig: Record<string, { label: string; color: string; bg: string }> = {
  'مبتدئ': { label: 'مبتدئ', color: 'text-emerald-700', bg: 'bg-emerald-500' },
  'متوسط': { label: 'متوسط', color: 'text-amber-700', bg: 'bg-amber-500' },
  'متقدم': { label: 'متقدم', color: 'text-rose-700', bg: 'bg-rose-500' },
  'beginner': { label: 'مبتدئ', color: 'text-emerald-700', bg: 'bg-emerald-500' },
  'intermediate': { label: 'متوسط', color: 'text-amber-700', bg: 'bg-amber-500' },
  'advanced': { label: 'متقدم', color: 'text-rose-700', bg: 'bg-rose-500' },
}

export default function HomeView() {
  const { navigate } = useAppStore()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Use static data directly - works on any hosting platform
    try {
      const { getCourses } = require('@/lib/static-data')
      const data = getCourses()
      setCourses(data)
      setLoading(false)
    } catch {
      // Fallback to API if static import fails
      fetch('/api/courses')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setCourses(data)
          setLoading(false)
        })
        .catch(() => {
          setError(true)
          setLoading(false)
        })
    }
  }, [])

  const categories = [
    { name: 'برمجة', icon: Code, gradient: 'from-emerald-400 to-teal-500', count: '20+ دورة', description: 'تطوير البرمجيات والتطبيقات' },
    { name: 'تصميم', icon: Palette, gradient: 'from-purple-400 to-violet-500', count: '15+ دورة', description: 'التصميم الإبداعي والتجربة' },
    { name: 'أعمال', icon: Briefcase, gradient: 'from-amber-400 to-orange-500', count: '10+ دورة', description: 'إدارة الأعمال والتسويق' },
    { name: 'لغات', icon: Globe, gradient: 'from-sky-400 to-blue-500', count: '8+ دورة', description: 'تعلم اللغات العالمية' },
    { name: 'علوم بيانات', icon: BarChart3, gradient: 'from-rose-400 to-pink-500', count: '12+ دورة', description: 'تحليل البيانات والذكاء الاصطناعي' },
  ]

  const stats = [
    { label: 'طالب نشط', value: '500+', icon: Users, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'دورة تعليمية', value: '50+', icon: BookOpen, gradient: 'from-teal-500 to-cyan-500' },
    { label: 'مدرب محترف', value: '20+', icon: GraduationCap, gradient: 'from-cyan-500 to-emerald-500' },
    { label: 'شهادة صادرة', value: '1000+', icon: Award, gradient: 'from-emerald-500 to-green-500' },
  ]

  const testimonials = [
    { name: 'محمد أحمد', role: 'مطور ويب', text: 'تغيّرت مسيرتي المهنية بالكامل بعد إتمام دورة تطوير الويب. المحتوى عالي الجودة والمدربون رائعون!' },
    { name: 'سارة خالد', role: 'مصممة واجهات', text: 'أفضل منصة تعليمية عربية. الدورات منظمة بشكل ممتاز والشهادات معتمدة ومفيدة في سوق العمل.' },
    { name: 'عبدالله سعيد', role: 'محلل بيانات', text: 'تعلمت تحليل البيانات من الصفر وحصلت على وظيفة أحلامي. شكراً لمنصة علم!' },
  ]

  const featuredCourses = courses.slice(0, 4)

  return (
    <div className="min-h-screen">
      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-600 via-emerald-700 to-teal-900 text-white">
        {/* Mesh pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-300/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] bg-teal-300/10 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-20 md:py-28 lg:py-32">
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
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 text-sm font-medium border border-white/10"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>منصة تعليمية عربية رائدة</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-7 leading-[1.15] tracking-tight">
                تعلّم بلا حدود
                <br />
                <span className="bg-gradient-to-l from-emerald-200 via-teal-200 to-white bg-clip-text text-transparent">
                  مع أفضل المدربين
                </span>
              </h1>

              <p className="text-lg md:text-xl text-emerald-100/90 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                اكتشف عالماً من المعرفة مع أفضل المدربين العرب. دورات تفاعلية، شهادات معتمدة، وتعلم ذاتي المعدل يناسب وقتك.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Button
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-9 py-7 rounded-2xl font-bold shadow-[0_8px_30px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 group"
                  onClick={() => navigate('courses')}
                >
                  استكشف الدورات
                  <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  className="bg-emerald-500/25 text-white hover:bg-emerald-500/40 backdrop-blur-md border border-white/20 text-lg px-9 py-7 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5 group"
                  onClick={() => navigate('dashboard')}
                >
                  <Play className="w-5 h-5 ml-2 transition-transform group-hover:scale-110" />
                  جرّبه مجاناً
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-5 justify-center lg:justify-start text-sm text-emerald-200/80">
                {[
                  { icon: CheckCircle, text: 'شهادات معتمدة' },
                  { icon: BookOpen, text: '+50 دورة تعليمية' },
                  { icon: Clock, text: 'دعم متواصل' },
                ].map((item) => (
                  <span key={item.text} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-emerald-300" />
                    {item.text}
                  </span>
                ))}
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
                {/* Glow effect behind illustration */}
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400/30 via-teal-400/20 to-cyan-400/30 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/15">
                  <img
                    src="/hero-illustration.png"
                    alt="منصة علم - تعلّم بلا حدود"
                    className="w-full h-auto"
                  />
                  {/* Inner glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-white/5" />
                </div>

                {/* Floating badge 1 - Certificate */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-5 -right-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex items-center gap-3 border border-white/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">شهادة</p>
                    <p className="text-sm font-bold text-gray-900">معتمدة دولياً</p>
                  </div>
                </motion.div>

                {/* Floating badge 2 - Active Students */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex items-center gap-3 border border-white/50"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/30">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">طلاب نشطون</p>
                    <p className="text-sm font-bold text-gray-900">+500 طالب</p>
                  </div>
                </motion.div>

                {/* Floating badge 3 - Rating */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/2 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-2 border border-white/50 hidden lg:flex"
                >
                  <div className="flex -space-x-1 space-x-reverse">
                    {[1, 2, 3].map(s => (
                      <Star key={s} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <span className="text-xs font-bold text-gray-800">4.9</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V20C240 0 480 40 720 30C960 20 1200 0 1440 20V60H0Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="relative bg-gray-50 pb-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] p-8 md:p-10 border border-gray-100/80">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-l from-transparent via-emerald-400 to-transparent rounded-full" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.5, duration: 0.4 }}
                  className="text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-xl group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1.5 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION DIVIDER ============ */}
      <div className="flex justify-center py-6">
        <div className="w-24 h-1 rounded-full bg-gradient-to-l from-emerald-400 to-teal-400" />
      </div>

      {/* ============ FEATURED COURSES ============ */}
      <section className="bg-gray-50 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
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
              initial={{ opacity: 0, scale: 0.95 }}
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
                onClick={loadCourses}
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
                    initial={{ opacity: 0, y: 24 }}
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
              initial={{ opacity: 0 }}
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

      {/* ============ SECTION DIVIDER ============ */}
      <div className="bg-white">
        <div className="flex justify-center py-6">
          <div className="w-24 h-1 rounded-full bg-gradient-to-l from-emerald-400 to-teal-400" />
        </div>
      </div>

      {/* ============ CATEGORIES ============ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 border-emerald-200 text-emerald-700 bg-emerald-50/50 px-4 py-1.5 text-sm font-medium">
              <TrendingUp className="w-3.5 h-3.5 ml-1.5" />
              تصفح المجالات
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">تصفح حسب التصنيف</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">اختر المجال الذي يناسب اهتماماتك وابدأ رحلة التعلم</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <Card
                  className="cursor-pointer group border-2 border-transparent hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-400 text-center p-6 rounded-2xl hover:-translate-y-1"
                  onClick={() => navigate('courses')}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-400`}>
                    <cat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors duration-300">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-1">{cat.description}</p>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full group-hover:bg-emerald-100 transition-colors">{cat.count}</span>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION DIVIDER ============ */}
      <div className="bg-gray-50">
        <div className="flex justify-center py-6">
          <div className="w-24 h-1 rounded-full bg-gradient-to-l from-emerald-400 to-teal-400" />
        </div>
      </div>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 border-emerald-200 text-emerald-700 bg-emerald-50/50 px-4 py-1.5 text-sm font-medium">
              <Quote className="w-3.5 h-3.5 ml-1.5" />
              آراء الطلاب
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">ماذا يقول طلابنا</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">تجارب حقيقية من طلاب استفادوا من منصتنا</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
              >
                <Card className="p-7 h-full border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-400 rounded-2xl relative overflow-hidden group">
                  {/* Top accent gradient line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-emerald-400 via-teal-400 to-emerald-500" />

                  {/* Quote decoration */}
                  <div className="absolute top-6 left-5 opacity-[0.06]">
                    <Quote className="w-20 h-20" />
                  </div>

                  <div className="relative">
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>

                    {/* Testimonial text */}
                    <p className="text-gray-600 mb-6 text-[15px] leading-relaxed">&ldquo;{t.text}&rdquo;</p>

                    {/* Author */}
                    <div className="flex items-center gap-3.5 pt-5 border-t border-gray-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-500/20 ring-2 ring-white">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{t.name}</p>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-600 via-emerald-700 to-teal-900 text-white py-24">
        {/* Mesh pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-400/15 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-300/10 rounded-full blur-[80px] -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 text-sm font-medium border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-300" />
              ابدأ اليوم مجاناً
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              ابدأ رحلة التعلم
              <br />
              <span className="bg-gradient-to-l from-emerald-200 via-teal-200 to-white bg-clip-text text-transparent">اليوم</span>
            </h2>

            <p className="text-emerald-100/80 mb-10 text-lg max-w-2xl mx-auto leading-relaxed">
              انضم إلى آلاف الطلاب الذين يطورون مهاراتهم يومياً. سجّل الآن واحصل على وصول مجاني لأول دورة.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-10 py-7 rounded-2xl font-bold shadow-[0_8px_30px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_-6px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 group"
                onClick={() => navigate('courses')}
              >
                سجّل الآن مجاناً
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              </Button>
              <Button
                size="lg"
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 text-lg px-8 py-7 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
                onClick={() => navigate('courses')}
              >
                تصفح الدورات
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
