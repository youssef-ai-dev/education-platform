import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-emerald-900 via-emerald-950 to-teal-950 flex flex-row" dir="ltr">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Left side - Sign In Form */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-8" dir="rtl">
        <div className="relative w-full max-w-md">
          <SignIn
            routing="path"
            path="/signin"
            signUpUrl="/signup"
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
            <p className="text-emerald-200/70 text-lg">منصتك التعليمية المتكاملة</p>
          </div>

          {/* Features */}
          <div className="space-y-5 text-right">
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">دورات تعليمية متنوعة</h3>
                <p className="text-sm text-emerald-200/60">آلاف الدورات في مختلف المجالات</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">تعلّم بذكاء</h3>
                <p className="text-sm text-emerald-200/60">ذكاء اصطناعي يساعدك في رحلة التعلم</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">شهادات معتمدة</h3>
                <p className="text-sm text-emerald-200/60">احصل على شهادة بعد إتمام كل دورة</p>
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
