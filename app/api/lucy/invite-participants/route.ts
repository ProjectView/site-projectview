/**
 * POST /api/lucy/invite-participants
 *
 * Envoie un email à chaque participant d'une réunion avec un lien personnel
 * vers la page publique /m/<meetingId>?t=<token>.
 *
 * Auth : header `x-lucy-key: <licenseKey>`.
 *
 * Body :
 *   {
 *     meetingId: string,
 *     participants: [{ email: string, name?: string }]
 *   }
 *
 * Réponse :
 *   {
 *     ok: boolean,
 *     sent: number,
 *     failed: number,
 *     results: [{ to: string, ok: boolean, error?: string }]
 *   }
 */

import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { findLicenseByKey } from '@/lib/lucy-licenses'
import { sendEmail, generateInviteToken } from '@/lib/email'
import { renderInviteEmail } from '@/lib/email-templates'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface InvitePayload {
  meetingId: string
  participants: Array<{ email: string; name?: string }>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function publicUrl(meetingId: string, token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'https://projectview.fr'
  return `${base}/m/${encodeURIComponent(meetingId)}?t=${encodeURIComponent(token)}`
}

export async function POST(request: Request) {
  try {
    const licenseKey = request.headers.get('x-lucy-key')?.trim()
    if (!licenseKey) {
      return NextResponse.json({ ok: false, error: 'Missing x-lucy-key' }, { status: 401 })
    }

    const body = (await request.json()) as InvitePayload
    if (!body?.meetingId || !Array.isArray(body.participants)) {
      return NextResponse.json(
        { ok: false, error: 'Missing meetingId or participants' },
        { status: 400 },
      )
    }

    const license = await findLicenseByKey(licenseKey)
    if (!license) {
      return NextResponse.json({ ok: false, error: 'Invalid license key' }, { status: 401 })
    }
    if (license.status === 'expired' || license.status === 'revoked') {
      return NextResponse.json({ ok: false, error: 'License expired or revoked' }, { status: 403 })
    }

    // Meeting existe et appartient à cette licence ?
    const db = getAdminFirestore()
    const meetingRef = db.collection('meetings').doc(body.meetingId)
    const meetingSnap = await meetingRef.get()
    if (!meetingSnap.exists) {
      return NextResponse.json({ ok: false, error: 'Meeting not found' }, { status: 404 })
    }
    const meeting = meetingSnap.data() as {
      licenseId?: string
      title?: string
      date?: string
      orgId?: string
    }
    if (meeting.licenseId && meeting.licenseId !== license.id) {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    }

    // Valide + déduplique
    const seen = new Set<string>()
    const invalid: string[] = []
    const valid: Array<{ email: string; name?: string }> = []
    for (const p of body.participants) {
      const email = (p?.email ?? '').trim().toLowerCase()
      if (!EMAIL_RE.test(email)) { invalid.push(email || '(vide)'); continue }
      if (seen.has(email)) continue
      seen.add(email)
      valid.push({ email, name: p?.name?.trim() || undefined })
    }

    if (valid.length === 0) {
      return NextResponse.json(
        { ok: false, sent: 0, failed: 0, invalid, error: 'no_valid_recipients' },
        { status: 400 },
      )
    }

    // Envoi email par participant (avec token unique stocké en subcollection)
    const senderName = license.clientName || undefined
    const licenseOrgId = (license as { orgId?: string | null }).orgId ?? null
    const meetingTitle = meeting.title || 'Réunion Lucy'
    const meetingDate = meeting.date || new Date().toISOString()

    const results: Array<{ to: string; ok: boolean; error?: string }> = []
    let sent = 0
    let failed = 0

    for (const p of valid) {
      const token = generateInviteToken()
      const url = publicUrl(body.meetingId, token)
      const { html, text, subject } = renderInviteEmail({
        recipientName: p.name,
        recipientEmail: p.email,
        meetingTitle,
        meetingDate,
        senderName,
        publicUrl: url,
      })

      // Persiste l'invitation AVANT l'envoi — si l'envoi échoue,
      // on peut retry / auditer ensuite.
      try {
        await meetingRef.collection('invites').doc(token).set({
          email: p.email,
          name: p.name ?? null,
          token,
          licenseId: license.id,
          orgId: meeting.orgId ?? licenseOrgId,
          createdAt: FieldValue.serverTimestamp(),
          sentAt: null,
          viewedAt: null,
        })
      } catch (err) {
        results.push({ to: p.email, ok: false, error: `persist_failed: ${err instanceof Error ? err.message : 'unknown'}` })
        failed++
        continue
      }

      const r = await sendEmail({
        to: p.email,
        subject,
        html,
        text,
      })

      if (r.ok) {
        sent++
        results.push({ to: p.email, ok: true })
        await meetingRef.collection('invites').doc(token).update({
          sentAt: FieldValue.serverTimestamp(),
          resendId: r.id ?? null,
        }).catch(() => {})
      } else {
        failed++
        results.push({ to: p.email, ok: false, error: r.error })
      }
    }

    // Met à jour la liste des participants sur le meeting (merge unique par email)
    try {
      const existing: string[] = Array.isArray((meeting as { participants?: string[] }).participants)
        ? (meeting as { participants?: string[] }).participants!
        : []
      const mergedSet = new Set<string>([...existing, ...valid.map(v => v.email)])
      await meetingRef.set({ participants: Array.from(mergedSet) }, { merge: true })
    } catch {
      // non-bloquant
    }

    return NextResponse.json({
      ok: failed === 0,
      sent,
      failed,
      invalid: invalid.length ? invalid : undefined,
      results,
    })
  } catch (err) {
    console.error('[API /lucy/invite-participants]', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
