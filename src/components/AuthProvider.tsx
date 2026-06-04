'use client'

import { useAuth, useUser } from '@clerk/nextjs'
import { ClerkProvider, SignIn, SignUp, UserButton as ClerkUserButton } from '@clerk/nextjs'

function ClerkThemeProvider({ children }: { children: React.ReactNode }) {
  return (
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
  )
}

export { ClerkThemeProvider as AuthProvider, useAuth, useUser }
export { ClerkUserButton, SignIn, SignUp }
