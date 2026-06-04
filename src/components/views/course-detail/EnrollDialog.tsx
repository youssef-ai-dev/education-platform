'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { CourseDetail } from './types'

interface EnrollDialogProps {
  course: CourseDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onEnrolled: (enrollment: { id: string; progress: number }) => void
}

export default function EnrollDialog({ course, open, onOpenChange, onEnrolled }: EnrollDialogProps) {
  const { selectedCourseId, studentName, studentEmail, setStudentInfo } = useAppStore()
  const [enrollName, setEnrollName] = useState(studentName)
  const [enrollEmail, setEnrollEmail] = useState(studentEmail)
  const [enrolling, setEnrolling] = useState(false)

  const totalLessons = course.lessons?.length ?? 0

  const handleEnroll = async () => {
    if (!enrollName.trim() || !enrollEmail.trim()) {
      toast.error('يرجى إدخال الاسم والبريد الإلكتروني')
      return
    }
    setEnrolling(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: enrollName,
          studentEmail: enrollEmail,
          courseId: selectedCourseId
        })
      })
      const data = await res.json()
      if (res.ok) {
        setStudentInfo(enrollName, enrollEmail)
        onEnrolled({ id: data.id, progress: 0 })
        toast.success('تم التسجيل في الدورة بنجاح!')
        onOpenChange(false)
      } else if (res.status === 409) {
        setStudentInfo(enrollName, enrollEmail)
        onEnrolled({ id: data.enrollment.id, progress: data.enrollment.progress })
        toast.info('أنت مسجل بالفعل في هذه الدورة')
        onOpenChange(false)
      } else {
        toast.error(data.error || 'حدث خطأ أثناء التسجيل')
      }
    } catch {
      toast.error('حدث خطأ أثناء التسجيل')
    }
    setEnrolling(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl border-0 shadow-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl">التسجيل في الدورة</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div className="bg-gradient-to-l from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
            <p className="font-semibold text-gray-800 text-sm">{course.title}</p>
            <p className="text-xs text-gray-500 mt-1">{course.instructor} • {totalLessons} درس</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">الاسم الكامل</Label>
            <Input
              id="name"
              placeholder="أدخل اسمك"
              value={enrollName}
              onChange={(e) => setEnrollName(e.target.value)}
              className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11 bg-gray-50/50 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={enrollEmail}
              onChange={(e) => setEnrollEmail(e.target.value)}
              dir="ltr"
              className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 h-11 bg-gray-50/50 focus:bg-white transition-colors text-left"
            />
          </div>
          <Button
            className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 rounded-xl text-base font-semibold shadow-lg shadow-emerald-500/20"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري التسجيل...
              </span>
            ) : 'تأكيد التسجيل'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
