'use client'

import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  GraduationCap,
  Search,
  Menu,
  LayoutDashboard,
  BookOpen,
  Home,
  Sparkles,
  LogIn,
} from 'lucide-react'
import { useAuth, useUser, SignInButton, UserButton } from '@/components/AuthProvider'

export default function Header() {
  const { navigate, searchQuery, setSearchQuery, currentView } = useAppStore()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

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
    <header className="sticky top-0 z-50 w-full">
      {/* Glass-morphism background layer */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />
      {/* Subtle top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-l from-emerald-400 via-emerald-500 to-emerald-600 opacity-80" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* ── Logo ── */}
          <button
            onClick={() => navigate('home')}
            className="group flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-l from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                علم
              </span>
              <span className="text-[10px] font-medium text-emerald-600/60 -mt-1 tracking-widest">
                منصة التعليم
              </span>
            </div>
          </button>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                    transition-all duration-300 ease-out
                    ${isActive
                      ? 'text-emerald-700 bg-emerald-50/80 shadow-sm shadow-emerald-200/50'
                      : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                    }
                  `}
                >
                  <item.icon className={`w-[18px] h-[18px] transition-colors duration-300 ${isActive ? 'text-emerald-600' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0.5 right-1/2 translate-x-1/2 h-[3px] w-6 rounded-full bg-gradient-to-l from-emerald-400 to-emerald-600" />
                  )}
                </button>
              )
            })}
          </nav>

          {/* ── Search + User (Desktop) ── */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <div className={`
                flex items-center gap-2 rounded-2xl border transition-all duration-300 ease-out
                ${searchFocused
                  ? 'border-emerald-400 bg-white shadow-lg shadow-emerald-100/60 ring-4 ring-emerald-50'
                  : 'border-gray-200/80 bg-gray-50/60 hover:border-gray-300 hover:bg-gray-50'
                }
              `}>
                <Search className={`w-4 h-4 mr-3 transition-colors duration-300 ${searchFocused ? 'text-emerald-500' : 'text-gray-400'}`} />
                <Input
                  placeholder="ابحث عن دورة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-52 h-10 text-sm border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="ml-1.5 mr-auto my-1.5 bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-8 px-4 rounded-xl font-medium text-white shadow-sm shadow-emerald-200/50"
                >
                  <Search className="w-3.5 h-3.5 ml-1" />
                  بحث
                </Button>
              </div>
            </form>

            {/* User section - safe with or without Clerk */}
            {isSignedIn && isLoaded ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 ring-2 ring-emerald-200 shadow-md"
                  }
                }}
              />
            ) : (
              <a
                href="/signin"
                className="inline-flex items-center justify-center whitespace-nowrap text-sm bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-10 px-5 rounded-xl font-semibold text-white shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all duration-300 gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 inline-block ml-1" />
                تسجيل الدخول
              </a>
            )}
          </div>

          {/* ── Mobile: Hamburger ── */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('courses')}
              className="h-10 w-10 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[300px] bg-white/95 backdrop-blur-xl border-l-emerald-100/50 p-0">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-bl from-emerald-50 via-white to-emerald-50/30" />
                  <div className="relative px-6 pt-8 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-extrabold bg-gradient-to-l from-emerald-600 to-emerald-800 bg-clip-text text-transparent">علم</span>
                        <span className="text-[10px] font-medium text-emerald-600/50 tracking-widest">منصة التعليم</span>
                      </div>
                    </div>

                    {/* User info in drawer - safe with or without Clerk */}
                    <div className="mt-5">
                      {isSignedIn && isLoaded ? (
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-emerald-100/60 shadow-sm">
                          <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                              elements: {
                                avatarBox: "w-10 h-10 ring-2 ring-white shadow-md"
                              }
                            }}
                          />
                          {user && (
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-700">{user.fullName || user.firstName}</span>
                              <span className="text-[11px] text-emerald-500 font-medium">طالب</span>
                            </div>
                          )}
                          <Sparkles className="w-4 h-4 text-amber-400 mr-auto" />
                        </div>
                      ) : (
                        <a
                          href="/signin"
                          className="w-full inline-flex items-center justify-center bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-11 rounded-xl font-semibold text-white shadow-md shadow-emerald-200/50 gap-2 cursor-pointer"
                        >
                          <LogIn className="w-4 h-4 inline-block ml-1" />
                          تسجيل الدخول
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-3">
                  <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false) }}>
                    <div className="relative">
                      <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="ابحث عن دورة..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10 h-11 text-sm bg-gray-50/80 border-gray-200/60 rounded-xl focus:border-emerald-400 focus:ring-emerald-100 focus-visible:ring-2" />
                    </div>
                  </form>
                </div>

                <div className="mx-6 h-px bg-gradient-to-l from-transparent via-emerald-200/60 to-transparent" />

                <div className="px-4 py-4 flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = currentView === item.key
                    return (
                      <button
                        key={item.key}
                        onClick={() => { navigate(item.key); setMobileOpen(false) }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ease-out ${isActive ? 'text-emerald-700 bg-emerald-50/80 shadow-sm' : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/40'}`}
                      >
                        <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 ${isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100/60 text-gray-400'}`}>
                          <item.icon className="w-[18px] h-[18px]" />
                        </div>
                        <span>{item.label}</span>
                        {isActive && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      </button>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-emerald-300/50 to-transparent" />
    </header>
  )
}
