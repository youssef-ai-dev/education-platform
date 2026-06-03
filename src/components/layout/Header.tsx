'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { GraduationCap, Search, Menu, User, LayoutDashboard, BookOpen, Home, Sun, Moon } from 'lucide-react'

export default function Header() {
  const { navigate, studentName, searchQuery, setSearchQuery, currentView } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

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

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700/50 shadow-sm transition-colors duration-300">
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
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">علم</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant={currentView === item.key ? 'default' : 'ghost'}
                className={currentView === item.key ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'}
                onClick={() => navigate(item.key)}
              >
                <item.icon className="w-4 h-4 ml-1" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Search + Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="ابحث عن دورة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-56 h-10 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg focus:border-emerald-500 focus:ring-emerald-500/20 dark:text-gray-200 dark:placeholder:text-gray-500"
                />
              </div>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-10 px-4 rounded-lg font-medium">
                <Search className="w-4 h-4 ml-1" />
                بحث
              </Button>
            </form>

            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-10 w-10 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                aria-label="تبديل الوضع الداكن"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            )}

            {/* User Info */}
            {studentName && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span>{studentName}</span>
              </div>
            )}
          </div>

          {/* Mobile: Theme + Menu */}
          <div className="flex items-center gap-1 md:hidden">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-10 w-10 rounded-lg text-gray-600 dark:text-gray-300"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 dark:bg-gray-900">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-emerald-600 text-white p-2 rounded-lg">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">علم</span>
                  </div>

                  <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false) }} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="ابحث عن دورة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-9 dark:bg-gray-800 dark:border-gray-700"
                      />
                    </div>
                  </form>

                  {navItems.map((item) => (
                    <Button
                      key={item.key}
                      variant={currentView === item.key ? 'default' : 'ghost'}
                      className={currentView === item.key ? 'bg-emerald-600 hover:bg-emerald-700 justify-start text-white' : 'justify-start text-gray-600 dark:text-gray-300'}
                      onClick={() => { navigate(item.key); setMobileOpen(false) }}
                    >
                      <item.icon className="w-4 h-4 ml-2" />
                      {item.label}
                    </Button>
                  ))}

                  {studentName && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg mt-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{studentName}</span>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
