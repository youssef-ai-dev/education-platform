'use client'

import { Sparkles, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

function FloatingOrb({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute rounded-full opacity-20 blur-2xl ${className}`} style={style} />
  )
}

export default function CoursesHeader() {
  return (
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
            initial={false}
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
  )
}
