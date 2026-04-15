/**
 * lib/email.ts — Wrapper Brevo (ex-Sendinblue) pour emails transactionnels.
 *
 * Utilise l'API REST Brevo directement via fetch — pas de SDK, zéro dépendance.
 * Doc : https://developers.brevo.com/reference/sendtransacemail
 *
 * Variables d'environnement requises :
 *   BREVO_API_KEY    clé API Brevo (commence par "xkeysib-...")
 *   EMAIL_FROM       "Lucy <lucy@projectview.fr>" ou juste "lucy@projectview.fr"
 *   EMAIL_REPLY_TO   (optionnel) reply-to, ex: "bernard@projectview.fr"
 */

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

/** Parse "Name <email@x.com>" ou "email@x.com" → { name?, email } */
function parseAddress(addr: string): { name?: string; email: string } {
  const m = addr.match(/^\s*(.+?)\s*<\s*([^>]+)\s*>\s*$/)
  if (m) return { name: m[1].trim(), email: m[2].trim() }
  return { email: addr.trim() }
}

function toRecipients(to: string | string[]): Array<{ email: string; name?: string }> {
  const arr = Array.isArray(to) ? to : [to]
  return arr.map(parseAddress)
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return { ok: false, error: 'BREVO_API_KEY not set' }

  const fromRaw = process.env.EMAIL_FROM
  if (!fromRaw) return { ok: false, error: 'EMAIL_FROM not set' }
  const sender = parseAddress(fromRaw)

  const replyToRaw = input.replyTo ?? process.env.EMAIL_REPLY_TO
  const replyTo = replyToRaw ? parseAddress(replyToRaw) : undefined

  const payload: Record<string, unknown> = {
    sender,
    to: toRecipients(input.to),
    subject: input.subject,
    htmlContent: input.html,
  }
  if (input.text) payload.textContent = input.text
  if (replyTo) payload.replyTo = replyTo

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = (await res.json().catch(() => ({}))) as {
      messageId?: string
      message?: string
      code?: string
    }

    if (!res.ok) {
      return { ok: false, error: data.message || data.code || `HTTP ${res.status}` }
    }
    return { ok: true, id: data.messageId }
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
