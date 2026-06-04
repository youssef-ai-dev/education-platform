/**
 * Sentry tunnel route — proxies browser events to Sentry
 * to circumvent ad-blockers that block requests to sentry.io
 *
 * This route is only active when NEXT_PUBLIC_SENTRY_DSN is set.
 */
export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return new Response('Sentry not configured', { status: 404 })
  }

  try {
    const envelope = await request.text()
    const dsn = new URL(process.env.NEXT_PUBLIC_SENTRY_DSN)

    // Forward the envelope to Sentry
    const response = await fetch(`https://${dsn.host}/api/${dsn.projectId}/envelope/`, {
      method: 'POST',
      body: envelope,
      headers: {
        'Content-Type': 'application/x-sentry-envelope',
      },
    })

    return new Response(null, { status: response.status })
  } catch (error) {
    console.error('Sentry tunnel error:', error)
    return new Response('Internal error', { status: 500 })
  }
}
