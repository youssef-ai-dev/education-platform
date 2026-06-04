'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { testimonials } from './constants'

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={false}
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
              initial={false}
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
  )
}
