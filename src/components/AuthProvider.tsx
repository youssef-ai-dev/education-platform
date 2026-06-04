'use client'

import { ClerkProvider, useAuth as useClerkAuth, useUser as useClerkUser, SignIn, SignUp, UserButton as ClerkUserButton, SignInButton } from '@clerk/nextjs'
import { Component, type ReactNode, createContext, useContext } from 'react'

// Safe auth context for components that need auth info
interface AuthContextType {
  isSignedIn: boolean
  isLoaded: boolean
  user: { fullName?: string; firstName?: string; imageUrl?: string } | null
}

const SafeAuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  isLoaded: false,
  user: null,
})

export function useAuth() {
  return useContext(SafeAuthContext)
}

export function useUser() {
  const { user, isLoaded } = useContext(SafeAuthContext)
  return { user, isLoaded }
}

// Bridge: reads Clerk auth state and provides it via SafeAuthContext
function AuthBridge({ children }: { children: ReactNode }) {
  let isSignedIn = false
  let isLoaded = false
  let user: { fullName?: string; firstName?: string; imageUrl?: string } | null = null

  try {
    const clerkAuth = useClerkAuth()
    const clerkUser = useClerkUser()
    isSignedIn = clerkAuth.isSignedIn ?? false
    isLoaded = clerkAuth.isLoaded ?? false
    if (clerkUser.user) {
      user = {
        fullName: clerkUser.user.fullName,
        firstName: clerkUser.user.firstName,
        imageUrl: clerkUser.user.imageUrl,
      }
    }
  } catch {
    // Clerk not available yet
  }

  return (
    <SafeAuthContext.Provider value={{ isSignedIn, isLoaded, user }}>
      {children}
    </SafeAuthContext.Provider>
  )
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

  componentDidCatch(error: Error) {
    console.warn('ClerkProvider error (falling back to no-auth mode):', error.message)
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAuthContext.Provider value={{ isSignedIn: false, isLoaded: true, user: null }}>
          {this.props.children}
        </SafeAuthContext.Provider>
      )
    }
    return this.props.children
  }
}

function ClerkThemeProvider({ children }: { children: ReactNode }) {
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
        <AuthBridge>{children}</AuthBridge>
      </ClerkProvider>
    </ClerkErrorBoundary>
  )
}

export { ClerkThemeProvider as AuthProvider }
export { ClerkUserButton as UserButton, SignInButton, SignIn, SignUp }
