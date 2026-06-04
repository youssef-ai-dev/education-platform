import '@testing-library/jest-dom'

// Mock @vercel/kv — it's an optional dependency that may not be installed
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
  },
}))

// Mock Sentry error reporting — it's an optional dependency
vi.mock('@sentry/nextjs', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
  replayIntegration: () => ({}),
}))

// Mock error reporting utility
vi.mock('@/lib/error-reporting', () => ({
  reportError: vi.fn(),
  reportWarning: vi.fn(),
  setUserContext: vi.fn(),
  clearUserContext: vi.fn(),
}))
