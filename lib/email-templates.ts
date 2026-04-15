/**
 * lib/email-templates.ts — Templates HTML pour les emails Pulse.
 *
 * Style inline (les clients email ignorent <style> et CSS externes).
 * Testé compatible Gmail, Outlook, Apple Mail.
 */

export interface InviteEmailParams {
  recipientName?: string
  recipientEmail: string
  meetingTitle: string
  meetingDate: string // ISO ou déjà formaté FR
  senderName?: string // ex: "Bernard Vidal"
  publicUrl: string   // https://projectview.fr/m/<id>?t=<token>
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDateFR(iso: string): string {
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function renderInviteEmail(p: InviteEmailParams): { html: string; text: string; subject: string } {
  const title = escapeHtml(p.meetingTitle)
  const dateStr = escapeHtml(formatDateFR(p.meetingDate))
  const name = p.recipientName ? escapeHtml(p.recipientName) : ''
  const sender = p.senderName ? escapeHtml(p.senderName) : 'Lucy'
  const url = p.publicUrl // URL — pas échappée pour le href, sera escaped dans le label

  const hello = name ? `Bonjour ${name},` : 'Bonjour,'
  const subject = `${p.meetingTitle} — résumé de la réunion`

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8" /><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;color:#222;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr>
          <td style="padding:24px 32px;background:linear-gradient(135deg,#6B46C1 0%,#9F7AEA 100%);color:#fff;">
            <div style="font-size:13px;letter-spacing:2px;opacity:0.85;text-transform:uppercase;">Projectview</div>
            <div style="font-size:24px;font-weight:700;margin-top:4px;">Lucy</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">${hello}</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">
              ${sender} vous partage le résumé de la réunion&nbsp;:
            </p>
            <div style="margin:20px 0;padding:16px 20px;background:#f5f3ff;border-left:4px solid #6B46C1;border-radius:4px;">
              <div style="font-size:17px;font-weight:600;color:#1a202c;margin-bottom:4px;">${title}</div>
              <div style="font-size:13px;color:#6b7280;">${dateStr}</div>
            </div>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.5;">
              Vous y retrouverez le résumé, les points d'actions et la transcription complète.
            </p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${url}" style="display:inline-block;padding:14px 28px;background:#6B46C1;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
                Voir le résumé
              </a>
            </div>
            <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;line-height:1.5;">
              Ce lien est personnel&nbsp;: il vous identifie comme participant à la réunion.
              Si vous n'en êtes pas le destinataire, ignorez ce message.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#fafafa;border-top:1px solid #eee;font-size:12px;color:#9ca3af;text-align:center;">
            Envoyé via <strong style="color:#6B46C1;">Lucy</strong> — l'agent IA de réunion de Projectview.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = `${hello}

${sender} vous partage le résumé de la réunion :

  ${p.meetingTitle}
  ${formatDateFR(p.meetingDate)}

Vous y retrouverez le résumé, les points d'actions et la transcription complète.

Voir le résumé : ${url}

Ce lien est personnel. Si vous n'êtes pas le destinataire, ignorez ce message.

— Lucy · Projectview`

  return { html, text, subject }
}
