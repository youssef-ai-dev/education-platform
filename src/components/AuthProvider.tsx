'use client'

import { ClerkProvider, useAuth as useClerkAuth, useUser as useClerkUser, SignIn, SignUp, UserButton as ClerkUserButton, SignInButton } from '@clerk/nextjs'
import { Component, type ReactNode } from 'react'

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
      // Render children without Clerk - site still works, just no auth
      return this.props.children
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
        {children}
      </ClerkProvider>
    </ClerkErrorBoundary>
  )
}

export { ClerkThemeProvider as AuthProvider }
export { useClerkAuth as useAuth, useClerkUser as useUser }
export { ClerkUserButton as UserButton, SignInButton, SignIn, SignUp }
