'use client'

import { useAppStore } from '@/store/useAppStore'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { categories } from './constants'

export default function CategoriesSection() {
  const { navigate } = useAppStore()

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={false}
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
              initial={false}
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
  )
}
