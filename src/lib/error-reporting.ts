/**
 * Centralized error reporting utility.
 *
 * In development: logs to console.
 * In production: reports to Sentry (if configured) + logs to console.
 *
 * Usage:
 * ```ts
 * import { reportError } from '@/lib/error-reporting'
 *
 * try {
 *   // risky operation
 * } catch (error) {
 *   reportError(error, { context: 'enrollment-creation', userId: 'user-123' })
 * }
 * ```
 */

interface ErrorContext {
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Report an error to monitoring systems.
 * Always logs to console, and sends to Sentry if configured.
 */
export function reportError(error: unknown, context?: ErrorContext): void {
  // Always log to console
  if (error instanceof Error) {
    console.error(`[${context?.context || 'App'}] ${error.message}`, {
      stack: error.stack,
      ...context,
    })
  } else {
    console.error(`[${context?.context || 'App'}]`, error, context)
  }

  // Report to Sentry if available
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      const Sentry = require('@sentry/nextjs')
      if (error instanceof Error) {
        Sentry.captureException(error, {
          extra: context,
        })
      } else {
        Sentry.captureMessage(String(error), {
          extra: context,
          level: 'error',
        })
      }
    } catch {
      // Sentry not available — already logged above
    }
  }
}

/**
 * Report a warning (non-critical issue).
 */
export function reportWarning(message: string, context?: ErrorContext): void {
  console.warn(`[${context?.context || 'App'}] ${message}`, context)

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      const Sentry = require('@sentry/nextjs')
      Sentry.captureMessage(message, {
        extra: context,
        level: 'warning',
      })
    } catch {
      // Sentry not available
    }
  }
}

/**
 * Add user context to error reports.
 * Call this when a user signs in.
 */
export function setUserContext(userId: string, email?: string): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      const Sentry = require('@sentry/nextjs')
      Sentry.setUser({ id: userId, email })
    } catch {
      // Sentry not available
    }
  }
}

/**
 * Clear user context when user signs out.
 */
export function clearUserContext(): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      const Sentry = require('@sentry/nextjs')
      Sentry.setUser(null)
    } catch {
      // Sentry not available
    }
  }
}
