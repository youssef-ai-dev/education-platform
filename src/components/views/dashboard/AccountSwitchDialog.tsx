'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface AccountSwitchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (name: string, email: string) => void
}

export default function AccountSwitchDialog({ open, onOpenChange, onLogin }: AccountSwitchDialogProps) {
  const { studentName, studentEmail, setStudentInfo } = useAppStore()
  const [inputName, setInputName] = useState(studentName)
  const [inputEmail, setInputEmail] = useState(studentEmail)

  const handleLogin = () => {
    if (!inputEmail.trim() || !inputName.trim()) {
      toast.error('يرجى إدخال الاسم والبريد الإلكتروني')
      return
    }
    setStudentInfo(inputName, inputEmail)
    onLogin(inputName, inputEmail)
    onOpenChange(false)
    toast.success('مرحباً بك!')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">تسجيل الدخول</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-right">
          <div className="space-y-2">
            <Label htmlFor="dialog-name" className="text-gray-700 font-medium text-sm">الاسم الكامل</Label>
            <Input
              id="dialog-name"
              placeholder="أدخل اسمك"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dialog-email" className="text-gray-700 font-medium text-sm">البريد الإلكتروني</Label>
            <Input
              id="dialog-email"
              type="email"
              placeholder="example@email.com"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              dir="ltr"
              className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50"
            />
          </div>
          <Button
            className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-11 shadow-md shadow-emerald-500/20 font-semibold"
            onClick={handleLogin}
          >
            دخول
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
