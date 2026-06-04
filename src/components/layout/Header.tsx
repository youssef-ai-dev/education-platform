'use client'

import { useState, useMemo } from 'react'
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
  LogOut,
  User as UserIcon,
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { navigate, studentName, searchQuery, setSearchQuery, currentView, user, setUser, logout: storeLogout } =
    useAppStore()
  const { data: session } = useSession()
  const router = useRouter()

  // Sync NextAuth session with Zustand store
  if (session?.user && !user) {
    setUser({
      id: (session.user as any).id || '',
      name: session.user.name || '',
      email: session.user.email || '',
      image: session.user.image || null,
      role: (session.user as any).role || 'student',
    })
  }

  const displayName = user?.name || studentName
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const navItems = [
    { key: 'home' as const, label: 'الرئيسية', icon: Home },
    { key: 'courses' as const, label: 'الدورات', icon: BookOpen },
    { key: 'dashboard' as const, label: 'لوحة التحكم', icon: LayoutDashboard },
  ]

  const initials = useMemo(() => {
    if (!displayName) return ''
    const parts = displayName.trim().split(/\s+/)
    if (parts.length >= 2) return parts[0][0] + parts[1][0]
    return parts[0].slice(0, 2)
  }, [displayName])

  const handleLogout = async () => {
    storeLogout()
    await signOut({ redirect: false })
  }

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
            {/* Icon with gradient */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            {/* Brand name */}
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
                    ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50/80 shadow-sm shadow-emerald-200/50'
                        : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50'
                    }
                  `}
                >
                  <item.icon
                    className={`w-[18px] h-[18px] transition-colors duration-300 ${
                      isActive ? 'text-emerald-600' : ''
                    }`}
                  />
                  <span>{item.label}</span>
                  {/* Active indicator pill */}
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
              <div
                className={`
                  flex items-center gap-2 rounded-2xl border transition-all duration-300 ease-out
                  ${
                    searchFocused
                      ? 'border-emerald-400 bg-white shadow-lg shadow-emerald-100/60 ring-4 ring-emerald-50'
                      : 'border-gray-200/80 bg-gray-50/60 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <Search
                  className={`w-4 h-4 mr-3 transition-colors duration-300 ${
                    searchFocused ? 'text-emerald-500' : 'text-gray-400'
                  }`}
                />
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
                  className="ml-1.5 mr-auto my-1.5 bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-8 px-4 rounded-xl font-medium text-white shadow-sm shadow-emerald-200/50 transition-all duration-200 hover:shadow-md hover:shadow-emerald-200/60"
                >
                  <Search className="w-3.5 h-3.5 ml-1" />
                  بحث
                </Button>
              </div>
            </form>

            {/* User section */}
            {displayName ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2.5 cursor-default">
                  <div className="relative group/avatar">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full blur-sm opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-300" />
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-emerald-200/40 ring-2 ring-white">
                      {initials}
                    </div>
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700 leading-tight">
                      {displayName}
                    </span>
                    <span className="text-[11px] text-emerald-500 font-medium">
                      {user?.role === 'instructor' ? 'مدرب' : user?.role === 'admin' ? 'مدير' : 'طالب'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-9 w-9 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-colors duration-200"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => router.push('/signin')}
                className="bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-10 px-5 rounded-xl font-semibold text-white shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all duration-300 gap-2"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </Button>
            )}
          </div>

          {/* ── Mobile: Hamburger ── */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile search trigger */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('courses')}
              className="h-10 w-10 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors duration-200"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] bg-white/95 backdrop-blur-xl border-l-emerald-100/50 p-0"
              >
                {/* Mobile drawer header */}
                <div className="relative overflow-hidden">
                  {/* Decorative gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-bl from-emerald-50 via-white to-emerald-50/30" />
                  <div className="relative px-6 pt-8 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-extrabold bg-gradient-to-l from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                          علم
                        </span>
                        <span className="text-[10px] font-medium text-emerald-600/50 tracking-widest">
                          منصة التعليم
                        </span>
                      </div>
                    </div>

                    {/* User info in drawer */}
                    {displayName ? (
                      <div className="mt-5 flex items-center gap-3 p-3 rounded-2xl bg-white/80 border border-emerald-100/60 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-emerald-200/40 ring-2 ring-white">
                          {initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-700">
                            {displayName}
                          </span>
                          <span className="text-[11px] text-emerald-500 font-medium">
                            {user?.role === 'instructor' ? 'مدرب' : user?.role === 'admin' ? 'مدير' : 'طالب'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleLogout}
                          className="mr-auto h-8 w-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50/50"
                        >
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-5">
                        <Button
                          onClick={() => { router.push('/signin'); setMobileOpen(false) }}
                          className="w-full bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 h-11 rounded-xl font-semibold text-white shadow-md shadow-emerald-200/50 gap-2"
                        >
                          <LogIn className="w-4 h-4" />
                          تسجيل الدخول
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search in drawer */}
                <div className="px-6 pb-3">
                  <form
                    onSubmit={(e) => {
                      handleSearch(e)
                      setMobileOpen(false)
                    }}
                  >
                    <div className="relative">
                      <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="ابحث عن دورة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10 h-11 text-sm bg-gray-50/80 border-gray-200/60 rounded-xl focus:border-emerald-400 focus:ring-emerald-100 focus-visible:ring-2"
                      />
                    </div>
                  </form>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-gradient-to-l from-transparent via-emerald-200/60 to-transparent" />

                {/* Nav items */}
                <div className="px-4 py-4 flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = currentView === item.key
                    return (
                      <button
                        key={item.key}
                        onClick={() => {
                          navigate(item.key)
                          setMobileOpen(false)
                        }}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                          transition-all duration-200 ease-out
                          ${
                            isActive
                              ? 'text-emerald-700 bg-emerald-50/80 shadow-sm shadow-emerald-100/50'
                              : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50/40'
                          }
                        `}
                      >
                        <div
                          className={`
                            flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200
                            ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-gray-100/60 text-gray-400 group-hover:text-emerald-500'
                            }
                          `}
                        >
                          <item.icon className="w-[18px] h-[18px]" />
                        </div>
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="mr-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Bottom gradient border */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-emerald-300/50 to-transparent" />
    </header>
  )
}
