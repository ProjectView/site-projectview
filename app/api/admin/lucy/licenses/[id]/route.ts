import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, checkAdminSession } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ── PATCH : mettre à jour une licence (status, expiry, email, clientName...) ──
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  try {
    const { id } = await params
    const db     = getAdminFirestore()
    const body   = await request.json()

    const allowed = ['status', 'type', 'email', 'clientName', 'screenName', 'monthlyPrice', 'expiresAt', 'features']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {}
    for (const field of allowed) {
      if (body[field] !== undefined) {
        if (field === 'expiresAt') {
          updates[field] = new Date(body[field])
        } else {
          updates[field] = body[field]
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Aucun champ à mettre à jour' }, { status: 400 })
    }

    await db.collection('licenses').doc(id).update(updates)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[lucy/licenses PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── DELETE : supprimer une licence ───────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  try {
    const { id } = await params
    const db     = getAdminFirestore()
    await db.collection('licenses').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[lucy/licenses DELETE]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
