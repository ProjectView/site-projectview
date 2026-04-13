import { NextResponse } from 'next/server'
import { checkAdminSession } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// URL GitHub Releases de base — à adapter selon le repo
const GITHUB_REPO = 'ProjectView/lucy-app'
const GITHUB_API  = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`

interface GithubAsset {
  name: string
  browser_download_url: string
  size: number
  updated_at: string
}

function detectPlatform(name: string): 'macos' | 'windows' | 'android' | null {
  const n = name.toLowerCase()
  if (n.endsWith('.dmg') || n.includes('universal') || n.includes('macos')) return 'macos'
  if (n.endsWith('.exe') || n.endsWith('.msi') || n.includes('windows') || n.includes('x64-setup')) return 'windows'
  if (n.endsWith('.apk') || n.includes('android')) return 'android'
  return null
}

function fmtSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export async function GET(request: Request) {
  try {
    const auth = await checkAdminSession(request)
    if (!auth.ok) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    // Tente de récupérer la dernière release GitHub
    let releaseData = null
    try {
      const ghRes = await fetch(GITHUB_API, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 300 }, // cache 5 min
      })
      if (ghRes.ok) {
        releaseData = await ghRes.json()
      }
    } catch {
      // GitHub non accessible — renvoie données statiques
    }

    if (releaseData) {
      const assets = (releaseData.assets as GithubAsset[])
        .map((asset) => {
          const platform = detectPlatform(asset.name)
          if (!platform) return null
          return {
            platform,
            version: releaseData.tag_name?.replace('v', '') || '0.3.0',
            fileName: asset.name,
            downloadUrl: asset.browser_download_url,
            fileSize: fmtSize(asset.size),
            releaseDate: asset.updated_at,
          }
        })
        .filter(Boolean)

      return NextResponse.json({
        version: releaseData.tag_name?.replace('v', '') || '0.3.0',
        releaseDate: releaseData.published_at,
        releaseNotes: releaseData.body?.split('\n')[0] || 'Nouvelle version disponible',
        assets,
        githubUrl: releaseData.html_url,
      })
    }

    // Fallback : données statiques (avant premier build CI)
    const fallbackVersion = '0.3.0'
    const today = new Date().toISOString()
    return NextResponse.json({
      version: fallbackVersion,
      releaseDate: today,
      releaseNotes: 'Premier build — lancer le workflow GitHub Actions pour générer les binaires.',
      assets: [], // Vide jusqu'au premier build CI
      githubUrl: `https://github.com/${GITHUB_REPO}/releases`,
    })
  } catch (err) {
    console.error('[/api/admin/lucy/downloads]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
