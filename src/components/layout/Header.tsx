'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { GraduationCap, Search, Menu, User, LayoutDashboard, BookOpen, Home } from 'lucide-react'

export default function Header() {
  const { navigate, studentName, searchQuery, setSearchQuery, currentView } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { key: 'home' as const, label: 'الرئيسية', icon: Home },
    { key: 'courses' as const, label: 'الدورات', icon: BookOpen },
    { key: 'dashboard' as const, label: 'لوحة التحكم', icon: LayoutDashboard },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate('courses')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-emerald-600 text-white p-2 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-emerald-700">علم</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant={currentView === item.key ? 'default' : 'ghost'}
                className={currentView === item.key ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-gray-600 hover:text-emerald-600'}
                onClick={() => navigate(item.key)}
              >
                <item.icon className="w-4 h-4 ml-1" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ابحث عن دورة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 w-56 bg-gray-50 border-gray-200 focus:border-emerald-500"
              />
            </div>
          </form>

          {/* User Info */}
          {studentName && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span>{studentName}</span>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-emerald-600 text-white p-2 rounded-lg">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-emerald-700">علم</span>
                </div>

                <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false) }} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="ابحث عن دورة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-9"
                    />
                  </div>
                </form>

                {navItems.map((item) => (
                  <Button
                    key={item.key}
                    variant={currentView === item.key ? 'default' : 'ghost'}
                    className={currentView === item.key ? 'bg-emerald-600 hover:bg-emerald-700 justify-start' : 'justify-start text-gray-600'}
                    onClick={() => { navigate(item.key); setMobileOpen(false) }}
                  >
                    <item.icon className="w-4 h-4 ml-2" />
                    {item.label}
                  </Button>
                ))}

                {studentName && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg mt-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-emerald-800">{studentName}</span>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
