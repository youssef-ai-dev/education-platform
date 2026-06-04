'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BookOpen, Mail, Lock, User, ArrowLeft, AlertCircle, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignInPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        name: isRegister ? name : undefined,
        redirect: false,
        callbackUrl: '/',
      })

      if (result?.error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else {
        // Success - redirect to home
        window.location.href = '/'
      }
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-bl from-emerald-600 via-emerald-700 to-teal-900 flex items-center justify-center p-4" dir="rtl">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-300/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Back to home button */}
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium"
        >
          <Home className="w-4 h-4" />
          العودة للرئيسية
        </button>
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-l from-emerald-400 via-teal-400 to-emerald-500" />

          <CardHeader className="text-center pb-2 pt-8 px-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              {isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isRegister ? 'انضم لمنصة علم وابدأ رحلتك التعليمية' : 'أهلاً بعودتك! سجّل دخولك للمتابعة'}
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8 pt-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="الاسم الكامل"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegister}
                    className="pr-11 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pr-11 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>

              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-11 h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-base font-bold rounded-xl shadow-lg shadow-emerald-200/50 transition-all duration-300"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isRegister ? 'إنشاء الحساب' : 'تسجيل الدخول'}
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsRegister(!isRegister)
                  setError('')
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                {isRegister ? 'لديك حساب بالفعل؟ سجّل دخولك' : 'ليس لديك حساب؟ أنشئ واحد الآن'}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
