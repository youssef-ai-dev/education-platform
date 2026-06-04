import * as Sentry from '@sentry/nextjs'

// Only initialize Sentry if DSN is provided
// This prevents crashes in Edge Runtime (Vercel middleware) when DSN is missing
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console
    debug: false,
  })
}
