/**
 * lib/email.ts — Wrapper Resend pour l'envoi d'emails transactionnels Pulse.
 *
 * Variables d'environnement requises :
 *   RESEND_API_KEY    clé API Resend (commence par "re_...")
 *   EMAIL_FROM        adresse d'envoi par défaut, ex: "Lucy <lucy@projectview.fr>"
 *   EMAIL_REPLY_TO    (optionnel) reply-to, ex: "bernard@projectview.fr"
 *
 * Utilisation :
 *   await sendEmail({ to, subject, html, text })
 */

import { Resend } from 'resend'

export interface SendEmailInput {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export interface SendEmailResult {
  ok: boolean
  id?: string
  error?: string
}

let _client: Resend | null = null
function getClient(): Resend {
  if (_client) return _client
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not set')
  _client = new Resend(key)
  return _client
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const from = process.env.EMAIL_FROM
  if (!from) return { ok: false, error: 'EMAIL_FROM not set' }

  try {
    const client = getClient()
    const { data, error } = await client.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo ?? process.env.EMAIL_REPLY_TO,
    })
    if (error) return { ok: false, error: error.message ?? String(error) }
    return { ok: true, id: data?.id }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

/** Génère un token URL-safe de longueur ~32 (192 bits). */
export function generateInviteToken(): string {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
