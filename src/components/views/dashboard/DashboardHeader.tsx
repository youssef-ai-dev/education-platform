'use client'

import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardHeaderProps {
  onSwitchAccount: () => void
}

export default function DashboardHeader({ onSwitchAccount }: DashboardHeaderProps) {
  const { studentName } = useAppStore()

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="bg-gradient-to-bl from-emerald-600 via-emerald-700 to-teal-800 text-white py-10 relative">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-5">
            <motion.div
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-sm flex items-center justify-center text-2xl font-bold ring-2 ring-white/20 shadow-lg">
                {studentName.charAt(0)}
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-400 ring-2 ring-emerald-700" />
            </motion.div>
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">مرحباً، {studentName} 👋</h1>
              <p className="text-emerald-200 mt-0.5 text-sm font-medium">تتبع تقدمك التعليمي وحقق أهدافك</p>
            </motion.div>
            <div className="mr-auto">
              <Button
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 gap-1.5 text-sm font-medium"
                onClick={onSwitchAccount}
              >
                <Zap className="w-4 h-4" />
                تبديل الحساب
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom curve */}
      <div className="h-6 bg-gradient-to-bl from-emerald-600 via-emerald-700 to-teal-800" />
      <div className="-mt-6 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 rounded-t-3xl" />
    </div>
  )
}
