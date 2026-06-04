'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CtaSection() {
  const { navigate } = useAppStore()

  return (
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
          initial={false}
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
  )
}
