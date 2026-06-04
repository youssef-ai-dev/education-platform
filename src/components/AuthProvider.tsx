'use client'

import { Component, type ReactNode, useState, useEffect, createContext, useContext } from 'react'

// Safe auth context that works even without Clerk
interface AuthContextType {
  isSignedIn: boolean
  isLoaded: boolean
  user: { fullName?: string; firstName?: string; imageUrl?: string } | null
}

const SafeAuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  isLoaded: true,
  user: null,
})

export function useAuth() {
  return useContext(SafeAuthContext)
}

export function useUser() {
  const { user } = useContext(SafeAuthContext)
  return { user, isLoaded: true }
}

// Error boundary to catch Clerk initialization errors
class ClerkErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('ClerkProvider error (falling back to no-auth mode):', error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.children
    }
    return this.props.children
  }
}

// Try to dynamically import Clerk
function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const [ClerkProvider, setClerkProvider] = useState<any>(null)
  const [clerkError, setClerkError] = useState(false)

  useEffect(() => {
    // Dynamic import of Clerk
    import('@clerk/nextjs').then((mod) => {
      setClerkProvider(() => mod.ClerkProvider)
    }).catch((err) => {
      console.warn('Clerk failed to load, running without auth:', err.message)
      setClerkError(true)
    })
  }, [])

  if (clerkError || !ClerkProvider) {
    // No Clerk available - render children directly with safe defaults
    return <SafeAuthContext.Provider value={{ isSignedIn: false, isLoaded: true, user: null }}>{children}</SafeAuthContext.Provider>
  }

  return (
    <ClerkErrorBoundary>
      <ClerkProvider
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: '#10b981',
            colorBackground: '#ffffff',
            colorInputBackground: '#f9fafb',
            colorInputText: '#111827',
            colorTextOnPrimaryBackground: '#ffffff',
          },
          elements: {
            formButtonPrimary:
              'bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200/30',
            card: 'rounded-2xl shadow-2xl border-0',
            headerTitle: 'text-xl font-black',
            headerSubtitle: 'text-sm',
            socialButtonsBlockButton:
              'rounded-xl border-gray-200 hover:bg-gray-50',
            dividerLine: 'bg-gray-200',
            formFieldLabel: 'text-gray-700 font-medium',
            formFieldInput:
              'rounded-xl bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-400',
            footerActionLink: 'text-emerald-600 hover:text-emerald-500',
          },
        }}
      >
        <ClerkAuthWrapper>{children}</ClerkAuthWrapper>
      </ClerkProvider>
    </ClerkErrorBoundary>
  )
}

// Wrapper that reads Clerk auth state safely
function ClerkAuthWrapper({ children }: { children: ReactNode }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuth: useClerkAuth, useUser: useClerkUser } = require('@clerk/nextjs')
    const { isSignedIn, isLoaded } = useClerkAuth()
    const { user } = useClerkUser()

    return (
      <SafeAuthContext.Provider value={{
        isSignedIn: isSignedIn ?? false,
        isLoaded: isLoaded ?? true,
        user: user ? { fullName: user.fullName, firstName: user.firstName, imageUrl: user.imageUrl } : null,
      }}>
        {children}
      </SafeAuthContext.Provider>
    )
  } catch {
    return <SafeAuthContext.Provider value={{ isSignedIn: false, isLoaded: true, user: null }}>{children}</SafeAuthContext.Provider>
  }
}

function ClerkThemeProvider({ children }: { children: ReactNode }) {
  return <ClerkAuthProvider>{children}</ClerkAuthProvider>
}

export { ClerkThemeProvider as AuthProvider }

// Re-export Clerk components with safe fallbacks
export function SignInButton({ children, ...props }: any) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ClerkSignInButton = require('@clerk/nextjs').SignInButton
    return <ClerkSignInButton {...props}>{children}</ClerkSignInButton>
  } catch {
    return <a href="/signin" {...props}>{children}</a>
  }
}

export function UserButton({ ...props }: any) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ClerkUserButton = require('@clerk/nextjs').UserButton
    return <ClerkUserButton {...props} />
  } catch {
    return <a href="/signin" className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold">?</a>
  }
}

export { SignIn, SignUp } from '@clerk/nextjs'
