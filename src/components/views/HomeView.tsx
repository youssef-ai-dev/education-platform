'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Users, BookOpen, Award, Star, ArrowLeft, Code, Palette, Briefcase, Globe, BarChart3 } from 'lucide-react'
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

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(() => setCourses([]))
  }, [])

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
      <section className="relative bg-gradient-to-bl from-emerald-600 via-emerald-700 to-teal-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoNnptMC0zMHY2aC02VjRoNnptMCAxMHY2aC02VjE0aDZ6bTAgMTB2NmgtNlYyNGg2ek02IDM0djZIMHYtNmg2em0wLTMwdjZIMHYtNmg2em0wIDEwdjZIMHYtNmg2em0wIDEwdjZIMHYtMjRoNnptMTAtMHY2aC02VjI0aDZ6bTAtMTB2NmgtNlYxNGg2em0wLTEwdjZoLTZWNmg2em0wMzB2NmgtNlYzNGg2em0wLTEwdjZoLTZWMjRoNnptMC0xMHY2aC02VjE0aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              تعلّم بلا حدود
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-8 leading-relaxed">
              اكتشف عالماً من المعرفة مع أفضل المدربين العرب. دورات تفاعلية، شهادات معتمدة، وتعلم ذاتي المعدل يناسب وقتك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 rounded-xl font-semibold"
                onClick={() => navigate('courses')}
              >
                استكشف الدورات
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
                onClick={() => navigate('dashboard')}
              >
                لوحة التحكم
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card
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
              </motion.div>
            ))}
          </div>
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
                  className="cursor-pointer hover:shadow-md transition-shadow text-center p-6 group"
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
                <Card className="p-6 h-full border-0 shadow-md hover:shadow-lg transition-shadow">
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
            className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-10 py-6 rounded-xl font-semibold"
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
