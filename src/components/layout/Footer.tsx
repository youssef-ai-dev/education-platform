'use client'

import { useAppStore } from '@/store/useAppStore'
import { GraduationCap, Mail, Phone, MapPin, Heart, ArrowUp, ExternalLink } from 'lucide-react'

export default function Footer() {
  const { navigate } = useAppStore()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gray-900 text-gray-300 mt-auto overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-l from-emerald-400 via-emerald-500 to-teal-500" />

      {/* Subtle decorative circles */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top section with logo and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column - spans 2 */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl blur-md opacity-40" />
                <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-white">علم</span>
                <span className="text-[10px] font-medium text-emerald-400/70 -mt-1 tracking-widest">منصة التعليم</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-6 max-w-sm">
              منصة تعليمية إلكترونية رائدة تهدف إلى توفير تعليم عالي الجودة باللغة العربية للجميع. نؤمن بأن التعلم حق للجميع ونسعى لتمكين الملايين من تطوير مهاراتهم.
            </p>
            {/* Social-like icons */}
            <div className="flex items-center gap-3">
              <a href="https://github.com/youssef-ai-dev" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-800/80 hover:bg-emerald-600/20 border border-gray-700/50 hover:border-emerald-500/30 flex items-center justify-center transition-all duration-300 group">
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
              </a>
              <a href="mailto:info@3ilm.com" className="w-10 h-10 rounded-xl bg-gray-800/80 hover:bg-emerald-600/20 border border-gray-700/50 hover:border-emerald-500/30 flex items-center justify-center transition-all duration-300 group">
                <Mail className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">روابط سريعة</h3>
            <div className="h-[2px] w-8 bg-gradient-to-l from-emerald-400 to-emerald-600 rounded-full mb-5" />
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors" />
                  الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => navigate('courses')} className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors" />
                  الدورات التعليمية
                </button>
              </li>
              <li>
                <button onClick={() => navigate('dashboard')} className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors" />
                  لوحة التحكم
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">التصنيفات</h3>
            <div className="h-[2px] w-8 bg-gradient-to-l from-emerald-400 to-emerald-600 rounded-full mb-5" />
            <ul className="space-y-3 text-sm">
              {['برمجة', 'تصميم', 'أعمال', 'لغات', 'علوم بيانات'].map((cat) => (
                <li key={cat}>
                  <button onClick={() => navigate('courses')} className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-emerald-400 transition-colors" />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">تواصل معنا</h3>
            <div className="h-[2px] w-8 bg-gradient-to-l from-emerald-400 to-emerald-600 rounded-full mb-5" />
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center group-hover:bg-emerald-600/20 group-hover:border-emerald-500/30 transition-all duration-300">
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">info@3ilm.com</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center group-hover:bg-emerald-600/20 group-hover:border-emerald-500/30 transition-all duration-300">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors" dir="ltr">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center group-hover:bg-emerald-600/20 group-hover:border-emerald-500/30 transition-all duration-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">الرياض، السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-l from-transparent via-gray-700/60 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            © 2024 علم. صنع بـ
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            بواسطة Youssef
          </p>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-400 transition-colors duration-200 group"
          >
            العودة للأعلى
            <div className="w-8 h-8 rounded-lg bg-gray-800/80 border border-gray-700/50 flex items-center justify-center group-hover:bg-emerald-600/20 group-hover:border-emerald-500/30 transition-all duration-300">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  )
}
