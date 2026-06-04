/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach with cleanup.
 *
 * For production, you should use Redis or a similar distributed store.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Store: key (IP or userId) -> route -> entry
const store = new Map<string, Map<string, RateLimitEntry>>()

// Cleanup old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  for (const [key, routes] of store.entries()) {
    for (const [route, entry] of routes.entries()) {
      if (now > entry.resetTime) {
        routes.delete(route)
      }
    }
    if (routes.size === 0) {
      store.delete(key)
    }
  }
}

export interface RateLimitOptions {
  /** Maximum number of requests per window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  limit: 30,
  windowSeconds: 60,
}

/**
 * Check if a request should be rate limited.
 * Returns true if the request is allowed, false if it should be rejected.
 */
export function checkRateLimit(
  identifier: string,
  route: string,
  options: RateLimitOptions = DEFAULT_OPTIONS
): { allowed: boolean; remaining: number; resetIn: number } {
  cleanup()

  const now = Date.now()
  const windowMs = options.windowSeconds * 1000

  if (!store.has(identifier)) {
    store.set(identifier, new Map())
  }

  const routes = store.get(identifier)!

  if (!routes.has(route)) {
    routes.set(route, {
      count: 1,
      resetTime: now + windowMs,
    })
    return { allowed: true, remaining: options.limit - 1, resetIn: windowMs }
  }

  const entry = routes.get(route)!

  // If window expired, reset
  if (now > entry.resetTime) {
    entry.count = 1
    entry.resetTime = now + windowMs
    return { allowed: true, remaining: options.limit - 1, resetIn: windowMs }
  }

  // Increment count
  entry.count++

  if (entry.count > options.limit) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now }
  }

  return { allowed: true, remaining: options.limit - entry.count, resetIn: entry.resetTime - now }
}

/**
 * Get identifier for rate limiting from a request.
 * Uses the authenticated userId if available, otherwise falls back to IP.
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`

  // Try to get IP from headers (works behind proxies)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) return `ip:${forwarded.split(',')[0].trim()}`
  if (realIp) return `ip:${realIp}`

  return `ip:unknown`
}

/**
 * Rate limit configurations for different route types.
 */
export const RATE_LIMITS = {
  // Public read routes - more generous
  courses: { limit: 60, windowSeconds: 60 },
  certificates: { limit: 30, windowSeconds: 60 },

  // Write operations - more restrictive
  enrollments: { limit: 10, windowSeconds: 60 },
  quizAttempts: { limit: 5, windowSeconds: 60 },
  generateCertificate: { limit: 3, windowSeconds: 60 },

  // Dangerous operations - very restrictive
  seed: { limit: 2, windowSeconds: 300 },
} as const
