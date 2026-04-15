/**
 * Page publique /m/[id]?t=<token>
 *
 * Affiche le résumé d'une réunion à un participant invité.
 * Le token (query param `t`) identifie l'invitation dans meetings/{id}/invites/{token}.
 *
 * Sécurité :
 *   - Pas de token ou token inconnu → 404
 *   - Le meeting doit exister
 *   - `viewedAt` est stampé à la première ouverture (tracking)
 */

import { notFound } from 'next/navigation'
import { FieldValue } from 'firebase-admin/firestore'
import { getAdminFirestore } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ t?: string }>
}

interface MeetingData {
  title?: string
  date?: string
  duration?: number
  clientName?: string
  deviceName?: string
  summary?: string
  transcript?: string
  language?: string
  participants?: string[]
}

interface SummaryParsed {
  sentiment?: string
  topics?: Array<{ title?: string; points?: string[]; duration?: string }>
  actions?: Array<{ text?: string; assignee?: string; deadline?: string }>
  decisions?: string[]
  text?: string
}

function parseSummary(raw: string | undefined): SummaryParsed {
  if (!raw) return {}
  if (typeof raw === 'object') return raw as SummaryParsed
  try {
    const p = JSON.parse(raw)
    if (p && typeof p === 'object') return p as SummaryParsed
  } catch {
    // Pas du JSON — texte libre
    return { text: raw }
  }
  return { text: raw }
}

function formatDateFR(iso: string | undefined): string {
  if (!iso) return ''
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

function formatDuration(secs: number | undefined): string {
  if (!secs || secs < 0) return ''
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m} min ${s.toString().padStart(2, '0')}`
}

export default async function PublicMeetingPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { t: token } = await searchParams

  if (!id || !token) notFound()

  const db = getAdminFirestore()
  const meetingRef = db.collection('meetings').doc(id)
  const [meetingSnap, inviteSnap] = await Promise.all([
    meetingRef.get(),
    meetingRef.collection('invites').doc(token).get(),
  ])

  if (!meetingSnap.exists || !inviteSnap.exists) notFound()

  // Stamp viewedAt (non bloquant)
  inviteSnap.ref.update({ viewedAt: FieldValue.serverTimestamp() }).catch(() => {})

  const meeting = meetingSnap.data() as MeetingData
  const invite = inviteSnap.data() as { email?: string; name?: string }

  const summary = parseSummary(meeting.summary as string | undefined)
  const dateStr = formatDateFR(meeting.date)
  const durStr = formatDuration(meeting.duration)

  return (
    <div style={{ minHeight: '100vh', background: '#f6f7fb', padding: '40px 16px' }}>
      <div
        style={{
          maxWidth: 760,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Header violet */}
        <div
          style={{
            padding: '28px 32px',
            background: 'linear-gradient(135deg,#6B46C1 0%,#9F7AEA 100%)',
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 2, opacity: 0.85, textTransform: 'uppercase' }}>
            Projectview · Lucy
          </div>
          <h1 style={{ margin: '8px 0 0', fontSize: 24, fontWeight: 700, lineHeight: 1.3 }}>
            {meeting.title || 'Réunion Lucy'}
          </h1>
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>
            {dateStr}
            {durStr ? ` · ${durStr}` : ''}
          </div>
        </div>

        <div style={{ padding: '28px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#222' }}>
          {invite.name || invite.email ? (
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6b7280' }}>
              Partagé avec <strong style={{ color: '#374151' }}>{invite.name || invite.email}</strong>
            </p>
          ) : null}

          {/* Résumé */}
          {summary.text && (
            <Section title="Résumé">
              <p style={{ margin: 0, lineHeight: 1.6 }}>{summary.text}</p>
            </Section>
          )}

          {/* Topics */}
          {Array.isArray(summary.topics) && summary.topics.length > 0 && (
            <Section title="Points abordés">
              {summary.topics.map((topic, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, color: '#1a202c', marginBottom: 4 }}>
                    {topic.title || `Sujet ${i + 1}`}
                    {topic.duration ? <span style={{ marginLeft: 8, fontSize: 12, color: '#9ca3af', fontWeight: 400 }}>{topic.duration}</span> : null}
                  </div>
                  {Array.isArray(topic.points) && topic.points.length > 0 && (
                    <ul style={{ margin: '4px 0 0 20px', padding: 0, lineHeight: 1.6 }}>
                      {topic.points.map((pt, j) => <li key={j}>{pt}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Actions */}
          {Array.isArray(summary.actions) && summary.actions.length > 0 && (
            <Section title={`Actions (${summary.actions.length})`}>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                {summary.actions.map((a, i) => (
                  <li key={i}>
                    {a.text || ''}
                    {a.assignee ? <span style={{ color: '#6B46C1', marginLeft: 6 }}>→ {a.assignee}</span> : null}
                    {a.deadline ? <span style={{ color: '#9ca3af', marginLeft: 6, fontSize: 13 }}>({a.deadline})</span> : null}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Décisions */}
          {Array.isArray(summary.decisions) && summary.decisions.length > 0 && (
            <Section title="Décisions">
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                {summary.decisions.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </Section>
          )}

          {/* Transcription — collapsible */}
          {meeting.transcript && (
            <Section title="Transcription complète">
              <details>
                <summary style={{ cursor: 'pointer', color: '#6B46C1', fontSize: 14 }}>
                  Afficher la transcription
                </summary>
                <pre style={{
                  marginTop: 12,
                  padding: 16,
                  background: '#fafafa',
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'inherit',
                }}>
                  {meeting.transcript}
                </pre>
              </details>
            </Section>
          )}

          {/* Footer */}
          <div style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: '1px solid #eee',
            fontSize: 12,
            color: '#9ca3af',
            textAlign: 'center',
          }}>
            Généré par <strong style={{ color: '#6B46C1' }}>Lucy</strong> — agent IA de réunion Projectview.
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{
        margin: '0 0 12px',
        fontSize: 15,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        color: '#6B46C1',
      }}>{title}</h2>
      {children}
    </section>
  )
}
