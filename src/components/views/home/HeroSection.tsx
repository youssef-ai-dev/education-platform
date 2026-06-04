'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { BookOpen, Star, ArrowLeft, Play, Sparkles, CheckCircle, Award, Users, Zap, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const { navigate } = useAppStore()

  return (
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
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-right"
          >
            <motion.div
              initial={false}
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
            initial={false}
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
  )
}
