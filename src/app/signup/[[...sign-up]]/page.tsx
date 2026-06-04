import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-emerald-900 via-emerald-950 to-teal-950 flex items-center justify-center p-4" dir="rtl">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

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
  )
}
