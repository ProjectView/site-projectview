import { NextRequest, NextResponse } from 'next/server'
import { findLicenseByKey } from '@/lib/lucy-licenses'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/lucy/upload-token
 *
 * Valide la licence Lucy et retourne les credentials Nextcloud pour
 * que Lucy puisse uploader directement (WebDAV streaming — évite la
 * limite 6 MB des fonctions Netlify).
 *
 * Header requis : x-lucy-key: <LICENSE_KEY>
 *
 * Response :
 *   { url, user, password, folderBase }
 *   folderBase = '/Lucy/<clientName_sanitisé>'
 */
function sanitize(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[/\\:*?"<>|]/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '')
      .trim() || 'default'
  )
}

export async function GET(request: NextRequest) {
  const licenseKey = request.headers.get('x-lucy-key')

  if (!licenseKey) {
    return NextResponse.json({ error: 'x-lucy-key header manquant.' }, { status: 401 })
  }

  const license = await findLicenseByKey(licenseKey)

  if (!license) {
    return NextResponse.json({ error: 'Licence introuvable.' }, { status: 403 })
  }

  if (license.status !== 'active') {
    return NextResponse.json({ error: `Licence ${license.status}.` }, { status: 403 })
  }

  const now = Date.now()
  const expTs = license.expiresAt ? new Date(license.expiresAt).getTime() : 0
  if (expTs < now) {
    return NextResponse.json({ error: 'Licence expirée.' }, { status: 403 })
  }

  const ncUrl = process.env.NEXTCLOUD_URL || 'https://cloud.projectview.fr'
  const ncUser = process.env.NEXTCLOUD_USER || ''
  const ncPassword = process.env.NEXTCLOUD_PASSWORD || ''

  if (!ncUser || !ncPassword) {
    console.error('[upload-token] Env vars NEXTCLOUD_USER / NEXTCLOUD_PASSWORD manquantes.')
    return NextResponse.json({ error: 'Configuration serveur incomplète.' }, { status: 500 })
  }

  const clientFolder = sanitize(license.clientName || license.email || 'default')

  return NextResponse.json({
    url: ncUrl,
    user: ncUser,
    password: ncPassword,
    folderBase: `/Lucy/${clientFolder}`,
  })
}
