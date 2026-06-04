import { GraduationCap, Users, BookOpen, Award, Code, Palette, Briefcase, Globe, BarChart3 } from 'lucide-react'

export const levelConfig: Record<string, { label: string; color: string; bg: string }> = {
  'مبتدئ': { label: 'مبتدئ', color: 'text-emerald-700', bg: 'bg-emerald-500' },
  'متوسط': { label: 'متوسط', color: 'text-amber-700', bg: 'bg-amber-500' },
  'متقدم': { label: 'متقدم', color: 'text-rose-700', bg: 'bg-rose-500' },
  'beginner': { label: 'مبتدئ', color: 'text-emerald-700', bg: 'bg-emerald-500' },
  'intermediate': { label: 'متوسط', color: 'text-amber-700', bg: 'bg-amber-500' },
  'advanced': { label: 'متقدم', color: 'text-rose-700', bg: 'bg-rose-500' },
}

export const categories = [
  { name: 'برمجة', icon: Code, gradient: 'from-emerald-400 to-teal-500', count: '20+ دورة', description: 'تطوير البرمجيات والتطبيقات' },
  { name: 'تصميم', icon: Palette, gradient: 'from-purple-400 to-violet-500', count: '15+ دورة', description: 'التصميم الإبداعي والتجربة' },
  { name: 'أعمال', icon: Briefcase, gradient: 'from-amber-400 to-orange-500', count: '10+ دورة', description: 'إدارة الأعمال والتسويق' },
  { name: 'لغات', icon: Globe, gradient: 'from-sky-400 to-blue-500', count: '8+ دورة', description: 'تعلم اللغات العالمية' },
  { name: 'علوم بيانات', icon: BarChart3, gradient: 'from-rose-400 to-pink-500', count: '12+ دورة', description: 'تحليل البيانات والذكاء الاصطناعي' },
]

export const stats = [
  { label: 'طالب نشط', value: '500+', icon: Users, gradient: 'from-emerald-500 to-teal-500' },
  { label: 'دورة تعليمية', value: '50+', icon: BookOpen, gradient: 'from-teal-500 to-cyan-500' },
  { label: 'مدرب محترف', value: '20+', icon: GraduationCap, gradient: 'from-cyan-500 to-emerald-500' },
  { label: 'شهادة صادرة', value: '1000+', icon: Award, gradient: 'from-emerald-500 to-green-500' },
]

export const testimonials = [
  { name: 'محمد أحمد', role: 'مطور ويب', text: 'تغيّرت مسيرتي المهنية بالكامل بعد إتمام دورة تطوير الويب. المحتوى عالي الجودة والمدربون رائعون!' },
  { name: 'سارة خالد', role: 'مصممة واجهات', text: 'أفضل منصة تعليمية عربية. الدورات منظمة بشكل ممتاز والشهادات معتمدة ومفيدة في سوق العمل.' },
  { name: 'عبدالله سعيد', role: 'محلل بيانات', text: 'تعلمت تحليل البيانات من الصفر وحصلت على وظيفة أحلامي. شكراً لمنصة علم!' },
]
