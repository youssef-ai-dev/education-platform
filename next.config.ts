import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,

  // Sentry source maps upload configuration
  // When NEXT_PUBLIC_SENTRY_DSN is set, Sentry will be enabled
  // and source maps will be uploaded during build
  sentry: {
    // Use the hidden source map setting to prevent exposing source maps in production
    // while still allowing Sentry to un-minify stack traces
    hideSourceMaps: true,
    // Disable the automatic instrumentation of the middleware
    // since we have our own custom middleware
    disableServerWebpackPlugin: process.env.NEXT_PUBLIC_SENTRY_DSN ? false : true,
    disableClientWebpackPlugin: process.env.NEXT_PUBLIC_SENTRY_DSN ? false : true,
  },
};

// Wrap with Sentry config if DSN is available
const withSentryConfig = async () => {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      const { withSentryConfig } = await import('@sentry/nextjs/config')
      return withSentryConfig(nextConfig, {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces
        widenClientFileUpload: true,

        // Transpiles SDK to be compatible with IE11 (increases bundle size)
        transpileClientSDK: false,

        // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
        tunnelRoute: '/monitoring',

        // Hides source maps from generated client bundles
        hideSourceMaps: true,

        // Automatically tree-shake Sentry logger statements to remove bundle size
        disableLogger: true,

        // Enables automatic instrumentation of Vercel Cron Monitors
        automaticVercelMonitors: true,
      })
    } catch {
      // Sentry package not available or misconfigured — use plain config
      return nextConfig
    }
  }
  return nextConfig
}

export default withSentryConfig()
