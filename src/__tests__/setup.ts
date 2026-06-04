import '@testing-library/jest-dom'

// Mock @vercel/kv — it's an optional dependency that may not be installed
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
  },
}))
