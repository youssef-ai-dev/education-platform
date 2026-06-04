import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

// Wrap with Sentry config if DSN is available and Sentry package is installed
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
