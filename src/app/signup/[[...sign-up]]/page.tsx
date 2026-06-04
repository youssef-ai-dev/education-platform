import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-emerald-900 via-emerald-950 to-teal-950 flex flex-row" dir="ltr">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Left side - Sign Up Form */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-8" dir="rtl">
        <div className="relative w-full max-w-md">
          <SignUp
            routing="path"
            path="/signup"
            signInUrl="/signin"
            redirectUrl="/"
            afterSignInUrl="/"
            afterSignUpUrl="/"
          />
        </div>
      </div>

      {/* Right side - Branding & Illustration */}
      <div className="hidden lg:flex relative w-1/2 flex-col items-center justify-center p-12 text-white" dir="rtl">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-emerald-500/15 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 text-center max-w-lg">
          {/* Logo / Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-4xl font-bold text-emerald-300">ع</span>
            </div>
            <h1 className="text-5xl font-bold mb-3">
              <span className="text-emerald-300">عِل</span><span className="text-white">م</span>
            </h1>
            <p className="text-emerald-200/70 text-lg">انضم لمجتمع المتعلمين</p>
          </div>

          {/* Benefits */}
          <div className="space-y-5 text-right">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">ابدأ فوراً</h3>
                <p className="text-sm text-emerald-200/60">سجّل وابدأ التعلم في دقائق</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">مجتمع تعليمي نشط</h3>
                <p className="text-sm text-emerald-200/60">تواصل مع آلاف المتعلمين والخبراء</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">تعلّم في وقتك</h3>
                <p className="text-sm text-emerald-200/60">محتوى متاح على مدار الساعة</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 flex items-center justify-center gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-300">+10K</div>
              <div className="text-xs text-emerald-200/50">طالب</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-teal-300">+500</div>
              <div className="text-xs text-emerald-200/50">دورة</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-cyan-300">+50</div>
              <div className="text-xs text-emerald-200/50">مدرّب</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
