import { NextRequest, NextResponse } from 'next/server'
import { checkAdminSession } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Proxy route to stream Nextcloud media files to the browser.
 * Nextcloud WebDAV URLs require authentication — this route adds
 * the credentials server-side so the browser can play audio/video.
 *
 * Usage: GET /api/admin/lucy/media?url=<encoded-nextcloud-url>
 *
 * Env vars required:
 *   NEXTCLOUD_USER     — e.g. "bernard"
 *   NEXTCLOUD_PASSWORD — app password or account password
 */
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  const url = request.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  // Security: only proxy requests to our Nextcloud instance
  const allowed = process.env.NEXTCLOUD_URL || 'https://cloud.projectview.fr'
  if (!url.startsWith(allowed)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
  }

  const ncUser = process.env.NEXTCLOUD_USER
  const ncPass = process.env.NEXTCLOUD_PASSWORD
  if (!ncUser || !ncPass) {
    return NextResponse.json(
      { error: 'Nextcloud credentials not configured (NEXTCLOUD_USER, NEXTCLOUD_PASSWORD)' },
      { status: 500 }
    )
  }

  try {
    const auth = Buffer.from(`${ncUser}:${ncPass}`).toString('base64')
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Nextcloud returned ${response.status}` },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentLength = response.headers.get('content-length')

    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    }
    if (contentLength) {
      headers['Content-Length'] = contentLength
    }

    // Stream the response body
    return new NextResponse(response.body, { status: 200, headers })
  } catch (err) {
    console.error('[API /admin/lucy/media GET]', err)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 502 })
  }
}
