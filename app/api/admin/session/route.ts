import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminAuth, checkAdminSession } from '@/lib/firebase-admin'
import { getSessionUserFromUid, touchUserLogin } from '@/lib/firestore-users'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SESSION_COOKIE_NAME = '__session'
const USER_INFO_COOKIE = '__user_info'
const SESSION_DURATION_MS = 60 * 60 * 24 * 5 * 1000 // 5 jours

// GET /api/admin/session — Vérifie si la session courante est valide
export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request)
  if (authError) return authError
  return NextResponse.json({ valid: true })
}

// POST /api/admin/session — Crée un cookie de session à partir d'un ID token Firebase
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()
    if (!idToken) {
      return NextResponse.json({ error: 'Token manquant.' }, { status: 400 })
    }

    // 1. Crée le session cookie httpOnly (5 jours)
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    })

    // 2. Décode le token pour récupérer l'uid / email
    const decoded = await getAdminAuth().verifyIdToken(idToken)

    // 3. Charge le profil RBAC depuis Firestore (peut être null si pas encore provisionné)
    const sessionUser = await getSessionUserFromUid(decoded.uid)

    if (sessionUser) {
      // Met à jour lastLoginAt de manière non-bloquante
      touchUserLogin(decoded.uid).catch(() => {})
    }

    const userInfo = JSON.stringify({
      email: decoded.email || sessionUser?.email || '',
      uid: decoded.uid,
      name:
        sessionUser?.displayName ||
        decoded.name ||
        decoded.email?.split('@')[0] ||
        'Admin',
      orgId: sessionUser?.orgId || null,
      globalRole: sessionUser?.globalRole || null,
      enabledApps: sessionUser?.enabledApps || {},
      appRoles: sessionUser?.appRoles || {},
    })

    const response = NextResponse.json({
      success: true,
      provisioned: !!sessionUser,
      globalRole: sessionUser?.globalRole || null,
    })

    // Cookie httpOnly pour l'authentification server-side
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    })

    // Cookie lisible côté client pour UI (sidebar, header…)
    response.cookies.set(USER_INFO_COOKIE, userInfo, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    })

    return response
  } catch (error) {
    console.error('Erreur création session:', error)
    return NextResponse.json(
      { error: 'Token invalide ou expiré.' },
      { status: 401 }
    )
  }
}

// DELETE /api/admin/session — Supprime le cookie de session (déconnexion)
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  response.cookies.set(USER_INFO_COOKIE, '', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
