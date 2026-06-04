'use client'

import { motion } from 'framer-motion'
import { stats } from './constants'

export default function StatsBar() {
  return (
    <section className="relative bg-gray-50 pb-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] p-8 md:p-10 border border-gray-100/80">
          {/* Subtle top accent */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-l from-transparent via-emerald-400 to-transparent rounded-full" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={false}
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
  )
}
