'use client'

import { useAppStore } from '@/store/useAppStore'
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const { navigate } = useAppStore()

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-600 text-white p-2 rounded-lg">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">علم</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              منصة تعليمية إلكترونية رائدة تهدف إلى توفير تعليم عالي الجودة باللغة العربية للجميع. نؤمن بأن التعلم حق للجميع.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('home')} className="hover:text-emerald-400 transition-colors">الرئيسية</button></li>
              <li><button onClick={() => navigate('courses')} className="hover:text-emerald-400 transition-colors">الدورات</button></li>
              <li><button onClick={() => navigate('dashboard')} className="hover:text-emerald-400 transition-colors">لوحة التحكم</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">التصنيفات</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => { navigate('courses') }} className="hover:text-emerald-400 transition-colors">برمجة</button></li>
              <li><button onClick={() => { navigate('courses') }} className="hover:text-emerald-400 transition-colors">تصميم</button></li>
              <li><button onClick={() => { navigate('courses') }} className="hover:text-emerald-400 transition-colors">أعمال</button></li>
              <li><button onClick={() => { navigate('courses') }} className="hover:text-emerald-400 transition-colors">لغات</button></li>
              <li><button onClick={() => { navigate('courses') }} className="hover:text-emerald-400 transition-colors">علوم بيانات</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>info@3ilm.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span dir="ltr">+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 علم. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
