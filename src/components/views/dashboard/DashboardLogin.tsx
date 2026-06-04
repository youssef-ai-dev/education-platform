'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface DashboardLoginProps {
  onLogin: (name: string, email: string) => void
}

export default function DashboardLogin({ onLogin }: DashboardLoginProps) {
  const [inputName, setInputName] = useState('')
  const [inputEmail, setInputEmail] = useState('')

  const handleLogin = () => {
    if (!inputEmail.trim() || !inputName.trim()) {
      toast.error('يرجى إدخال الاسم والبريد الإلكتروني')
      return
    }
    onLogin(inputName, inputEmail)
    toast.success('مرحباً بك!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full mx-4 relative z-10"
      >
        <Card className="overflow-hidden border-0 shadow-2xl shadow-emerald-900/10 bg-white">
          {/* Top gradient accent */}
          <div className="h-1.5 bg-gradient-to-l from-emerald-500 via-teal-500 to-emerald-600" />
          <div className="p-8 text-center">
            {/* Logo icon */}
            <motion.div
              initial={false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h2
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900 mb-1.5"
            >
              لوحة التحكم
            </motion.h2>
            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-gray-500 mb-7 text-sm"
            >
              سجّل دخولك لمتابعة تقدمك في الدورات
            </motion.p>
            <div className="space-y-4 text-right">
              <motion.div
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="dash-name" className="text-gray-700 font-medium text-sm">الاسم الكامل</Label>
                <Input
                  id="dash-name"
                  placeholder="أدخل اسمك"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 transition-all duration-200 text-right placeholder:text-gray-300"
                />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="space-y-2"
              >
                <Label htmlFor="dash-email" className="text-gray-700 font-medium text-sm">البريد الإلكتروني</Label>
                <Input
                  id="dash-email"
                  type="email"
                  placeholder="example@email.com"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  dir="ltr"
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 transition-all duration-200 placeholder:text-gray-300"
                />
              </motion.div>
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 mt-2 py-5.5 h-12 text-base font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                  onClick={handleLogin}
                >
                  دخول
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
