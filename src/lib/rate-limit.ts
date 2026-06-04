/**
 * Rate limiter with Vercel KV support and in-memory fallback.
 *
 * - In production on Vercel: uses Vercel KV (Redis) for distributed rate limiting
 *   that persists across serverless function invocations.
 * - In development or without KV: falls back to in-memory store.
 *
 * To enable Vercel KV rate limiting in production:
 * 1. Install: npm install @vercel/kv
 * 2. Add KV env vars in Vercel dashboard (automatically set when you create a KV store)
 * 3. The rate limiter will automatically detect and use KV
 */

export interface RateLimitOptions {
  /** Maximum number of requests per window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetIn: number
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  limit: 30,
  windowSeconds: 60,
}

// ─── In-Memory Store (fallback) ───────────────────────────────

interface RateLimitEntry {
  count: number
  resetTime: number
}

const memoryStore = new Map<string, Map<string, RateLimitEntry>>()
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanupMemory() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  for (const [key, routes] of memoryStore.entries()) {
    for (const [route, entry] of routes.entries()) {
      if (now > entry.resetTime) {
        routes.delete(route)
      }
    }
    if (routes.size === 0) {
      memoryStore.delete(key)
    }
  }
}

function checkRateLimitMemory(
  identifier: string,
  route: string,
  options: RateLimitOptions
): RateLimitResult {
  cleanupMemory()

  const now = Date.now()
  const windowMs = options.windowSeconds * 1000
  const key = `${identifier}:${route}`

  if (!memoryStore.has(identifier)) {
    memoryStore.set(identifier, new Map())
  }

  const routes = memoryStore.get(identifier)!

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

  entry.count++

  if (entry.count > options.limit) {
    return { allowed: false, remaining: 0, resetIn: entry.resetTime - now }
  }

  return { allowed: true, remaining: options.limit - entry.count, resetIn: entry.resetTime - now }
}

// ─── Vercel KV Store (production) ─────────────────────────────

async function checkRateLimitKV(
  identifier: string,
  route: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  try {
    // Dynamic import — only loads KV if available at runtime
    // Using Function constructor to prevent Vite/Turbopack from analyzing the import
    // This is the standard pattern for optional dependencies in Vite environments
    const dynamicImport = new Function('module', 'return import(module)')
    const { kv } = await dynamicImport('@vercel/kv')

    const key = `ratelimit:${identifier}:${route}`
    const windowMs = options.windowSeconds * 1000
    const now = Date.now()

    // Get current entry
    const entry = await kv.get<{ count: number; resetTime: number }>(key)

    if (!entry || now > entry.resetTime) {
      // New window
      const newEntry = { count: 1, resetTime: now + windowMs }
      await kv.set(key, newEntry, { ex: options.windowSeconds + 10 })
      return { allowed: true, remaining: options.limit - 1, resetIn: windowMs }
    }

    // Increment count
    const newCount = entry.count + 1
    await kv.set(key, { ...entry, count: newCount }, { ex: Math.ceil((entry.resetTime - now) / 1000) + 10 })

    if (newCount > options.limit) {
      return { allowed: false, remaining: 0, resetIn: entry.resetTime - now }
    }

    return { allowed: true, remaining: options.limit - newCount, resetIn: entry.resetTime - now }
  } catch {
    // KV not available — fall back to memory
    return checkRateLimitMemory(identifier, route, options)
  }
}

// ─── Main Export ──────────────────────────────────────────────

/**
 * Check if a request should be rate limited.
 * Automatically uses Vercel KV in production (if available),
 * otherwise falls back to in-memory store.
 */
export async function checkRateLimit(
  identifier: string,
  route: string,
  options: RateLimitOptions = DEFAULT_OPTIONS
): Promise<RateLimitResult> {
  // Use KV in production if available
  if (process.env.VERCEL && process.env.KV_REST_API_URL) {
    return checkRateLimitKV(identifier, route, options)
  }

  // Fallback to in-memory
  return checkRateLimitMemory(identifier, route, options)
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
