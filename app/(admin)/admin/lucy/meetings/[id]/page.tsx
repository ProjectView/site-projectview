'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Mic, ArrowLeft, Clock, Users, Globe, Monitor,
  FileText, ListChecks, Play, Pause, Download, ExternalLink,
  Camera, Send, X, Check, Zap, ChevronRight, Mail,
  Volume2, Shield, Trash2, AlertTriangle
} from 'lucide-react'

interface Retention {
  ageDays: number
  daysRemaining: number
  status: 'ok' | 'warning' | 'expired'
}

interface Meeting {
  id: string; title: string; date: string; duration: number
  participants: string[]; clientName: string; deviceName: string
  summary: string; transcript: string
  audioUrl: string; cameraUrl: string; screenUrl: string
  nextcloudPath: string; language: string
  licenseKey: string; licenseId: string; lucyVersion: string
  mode: string
  createdAt: string | null; syncedAt: string | null
  retention: Retention
}

interface StructuredSummary {
  title?: string
  summary?: string
  executive_summary?: string
  executiveSummary?: string
  key_points?: string[]
  keyPoints?: string[]
  decisions?: string[]
  action_items?: Array<{ task: string; owner?: string; deadline?: string; priority?: string }>
  actionItems?: Array<{ task: string; owner?: string; deadline?: string; priority?: string } | string>
  actions?: string[]
  next_steps?: string[]
  nextSteps?: string[]
  topics_discussed?: Array<{ topic: string; duration?: string; summary?: string }>
  topicsDiscussed?: Array<{ topic: string; duration?: string; summary?: string }>
  detected_participants?: string[]
  sentiment?: string
  [key: string]: unknown
}

interface TranscriptSegment {
  ts: string
  speaker?: string
  text: string
}

function dur(s: number) {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  if (m >= 60) { const h = Math.floor(m / 60); return `${h}h${(m % 60).toString().padStart(2, '0')}` }
  return `${m} min ${s % 60}s`
}

function fmt(d: string | null) {
  if (!d) return '—'
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(d))
  } catch { return d }
}

function parseSummary(raw: string): StructuredSummary | null {
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

function parseTranscript(raw: string): TranscriptSegment[] {
  if (!raw) return []
  // Try SRT-like format: timestamps + text
  const lines = raw.split('\n').filter(l => l.trim())
  const segments: TranscriptSegment[] = []
  const srtRegex = /^(\d{2}:\d{2}(?::\d{2})?(?:[,.]\d+)?)\s*(?:-->.*?)?\s*$/
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(srtRegex)
    if (match && i + 1 < lines.length) {
      segments.push({ ts: match[1], text: lines[i + 1] })
      i++
    }
  }
  if (segments.length > 0) return segments
  // Fallback: split by newlines
  return lines.map((line, i) => ({ ts: '', speaker: '', text: line }))
}

const MODE_COLORS: Record<string, string> = {
  local: '#10b981',
  cloud: '#3b82f6',
  hybrid: '#8b5cf6',
  hybride: '#8b5cf6',
}

const SENTIMENT_COLORS: Record<string, string> = {
  constructif: '#6B5CE7',
  positif: '#10b981',
  neutre: '#9ca3af',
  tendu: '#f59e0b',
  enthousiaste: '#10b981',
  negatif: '#ef4444',
}

/* ─── AudioPlayer ────────────────────────────────────────────────────────────── */
function AudioPlayer({ url, label, icon: IconComp }: { url: string; label: string; icon?: React.ElementType }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => setPlaying(false)
    return () => { audio.pause(); audio.src = '' }
  }, [url])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  const I = IconComp || Mic
  return (
    <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg group hover:bg-white/[0.05] transition-colors">
      <button onClick={toggle}
        className="w-9 h-9 rounded-full bg-brand-teal/20 flex items-center justify-center hover:bg-brand-teal/30 transition-colors flex-shrink-0">
        {playing
          ? <Pause className="w-4 h-4 text-brand-teal" />
          : <Play  className="w-4 h-4 text-brand-teal ml-0.5" />}
      </button>
      <I className="w-4 h-4 text-ink-tertiary flex-shrink-0" />
      <span className="text-sm text-ink-secondary flex-1">{label}</span>
      <a href={url} target="_blank" rel="noreferrer" download
        className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors opacity-0 group-hover:opacity-100">
        <Download className="w-4 h-4 text-ink-tertiary" />
      </a>
    </div>
  )
}

/* ─── Main Page Component ────────────────────────────────────────────────────── */
export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [tab, setTab] = useState<'resume' | 'transcription' | 'actions'>('resume')
  const [showRaw, setShowRaw] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/lucy/meetings/${id}`)
      .then(r => r.ok ? r.json() : r.json().then((j: { error: string }) => { throw new Error(j.error) }))
      .then(setMeeting)
      .catch((e: Error) => setErr(e.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!meeting) return
    setDeleting(true)
    try {
      const r = await fetch(`/api/admin/lucy/meetings/${meeting.id}`, { method: 'DELETE' })
      if (!r.ok) { const j = await r.json(); throw new Error(j.error || 'Erreur') }
      setDeleted(true)
      setShowDeleteConfirm(false)
      setTimeout(() => router.push('/admin/lucy/meetings'), 2000)
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Erreur suppression')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="h-6 w-48 bg-white/[0.04] rounded animate-pulse mb-8" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/[0.04] rounded-xl animate-pulse" />)}
      </div>
    </div>
  )

  if (err && !meeting) return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-ink-tertiary hover:text-ink-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">{err}</div>
    </div>
  )

  if (!meeting) return null

  const structured = parseSummary(meeting.summary)
  const execSummary = structured?.executive_summary ?? structured?.executiveSummary ?? structured?.summary ?? (typeof meeting.summary === 'string' && !structured ? meeting.summary : '')
  const keyPoints: string[] = structured?.key_points ?? structured?.keyPoints ?? []
  const decisions: string[] = structured?.decisions ?? []
  const nextSteps: string[] = structured?.next_steps ?? structured?.nextSteps ?? []
  const sentiment = structured?.sentiment ?? ''
  const topics = structured?.topics_discussed ?? structured?.topicsDiscussed ?? []
  const actionItems = structured?.action_items ?? structured?.actionItems ?? structured?.actions?.map(a => typeof a === 'string' ? { task: a } : a) ?? []
  const transcriptSegments = parseTranscript(meeting.transcript)

  const hasAudio  = !!meeting.audioUrl
  const hasCamera = !!meeting.cameraUrl
  const hasScreen = !!meeting.screenUrl
  const modeColor = MODE_COLORS[meeting.mode?.toLowerCase()] ?? '#9ca3af'
  const sentimentColor = SENTIMENT_COLORS[sentiment?.toLowerCase()] ?? '#9ca3af'
  const retention = meeting.retention

  return (
    <div className="p-6 max-w-5xl mx-auto pb-16">
      {/* Back */}
      <button onClick={() => router.push('/admin/lucy/meetings')}
        className="flex items-center gap-2 text-sm text-ink-tertiary hover:text-ink-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Toutes les réunions
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center flex-shrink-0 mt-1">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-ink-primary mb-1">{meeting.title || 'Sans titre'}</h1>
              <div className="text-sm text-ink-tertiary flex items-center gap-2 flex-wrap">
                <span>{fmt(meeting.date)}</span>
                {/* Retention badge */}
                {retention.status === 'warning' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    {retention.daysRemaining}j restants
                  </span>
                )}
                {retention.status === 'expired' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
                    Expirée
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Media badges */}
            <div className="flex gap-1.5">
              {hasAudio && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                  <Mic className="w-3 h-3" /> Audio
                </span>
              )}
              {hasCamera && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Camera className="w-3 h-3" /> Caméra
                </span>
              )}
              {hasScreen && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Monitor className="w-3 h-3" /> Écran
                </span>
              )}
            </div>
            {/* Delete button */}
            {!deleted && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 border border-red-500/25 rounded-lg text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            )}
          </div>
        </div>

        {/* Delete confirmation banner */}
        {showDeleteConfirm && (
          <div className="mb-4 p-4 bg-red-500/[0.08] rounded-xl border border-red-500/20 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-400 mb-1">Confirmer la suppression ?</p>
              <p className="text-xs text-ink-tertiary">Cette action est irréversible. Pensez à télécharger le PDF ou les médias avant.</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 bg-white/[0.06] border border-white/[0.1] rounded-lg text-xs text-ink-tertiary hover:text-ink-primary transition-colors">
                Annuler
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg text-xs text-red-400 font-semibold hover:bg-red-500/30 transition-colors disabled:opacity-50">
                {deleting ? '…' : 'Oui, supprimer'}
              </button>
            </div>
          </div>
        )}

        {/* Deleted confirmation */}
        {deleted && (
          <div className="mb-4 p-3 bg-emerald-500/[0.08] rounded-xl border border-emerald-500/20 text-center text-sm text-emerald-400 font-medium">
            Réunion supprimée avec succès. Redirection…
          </div>
        )}

        {/* Retention warning banner */}
        {retention.status === 'warning' && !deleted && (
          <div className="mb-4 p-3 bg-amber-500/[0.06] rounded-xl border border-amber-500/15 flex items-center gap-3 text-sm text-ink-secondary">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Cette réunion sera supprimée dans <strong className="text-amber-400">{retention.daysRemaining} jours</strong>. Téléchargez le PDF ou sauvegardez avant expiration.</span>
          </div>
        )}
        {retention.status === 'expired' && !deleted && (
          <div className="mb-4 p-3 bg-red-500/[0.06] rounded-xl border border-red-500/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-ink-secondary">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Période de rétention expirée (90 jours). <strong className="text-red-400">Téléchargez avant suppression automatique.</strong></span>
            </div>
          </div>
        )}

        {/* Meta cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { icon: Clock, label: 'Durée', value: dur(meeting.duration), color: '' },
            { icon: Users, label: 'Participants', value: String(meeting.participants?.length || 0), color: '' },
            { icon: Globe, label: 'Langue', value: meeting.language?.toUpperCase() || '—', color: '' },
            { icon: Monitor, label: 'Mode', value: (meeting.mode || 'cloud').toUpperCase(), color: modeColor },
            { icon: Shield, label: 'Rétention', value: `${retention.daysRemaining}j / 90j`, color: retention.daysRemaining < 14 ? '#f59e0b' : '' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-dark-surface border border-white/[0.06] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-3.5 h-3.5 text-ink-tertiary" />
                <span className="text-xs text-ink-tertiary uppercase tracking-wider">{label}</span>
              </div>
              <span className="text-sm font-semibold text-ink-primary" style={color ? { color } : undefined}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TWO COLUMNS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT COLUMN: Media + Share */}
        <div className="space-y-5">
          {/* Media */}
          {(hasAudio || hasCamera || hasScreen) && (
            <div className="bg-dark-surface border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink-secondary flex items-center gap-2">
                  <Play className="w-4 h-4" /> Médias
                </h2>
              </div>
              <div className="p-5 space-y-2">
                {hasAudio && <AudioPlayer url={meeting.audioUrl} label="Audio de la réunion" icon={Mic} />}
                {hasCamera && <AudioPlayer url={meeting.cameraUrl} label="Caméra" icon={Camera} />}
                {hasScreen && (
                  <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                    <Monitor className="w-4 h-4 text-ink-tertiary" />
                    <span className="text-sm text-ink-secondary flex-1">Capture d&apos;écran</span>
                    <a href={meeting.screenUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-brand-teal hover:underline">
                      Ouvrir <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Participants */}
          {meeting.participants?.length > 0 && (
            <div className="bg-dark-surface border border-white/[0.06] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-ink-secondary mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> Participants
              </h2>
              <div className="flex flex-wrap gap-2">
                {meeting.participants.map((p, i) => (
                  <span key={i} className="px-3 py-1 bg-brand-teal/10 border border-brand-teal/20 rounded-full text-sm text-brand-teal">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata footer */}
          <div className="bg-dark-surface border border-white/[0.06] rounded-xl p-5">
            <button onClick={() => setShowRaw(v => !v)}
              className="flex items-center gap-2 text-xs text-ink-tertiary hover:text-ink-secondary transition-colors">
              <span>{showRaw ? '▾' : '▸'}</span> Métadonnées techniques
            </button>
            {showRaw && (
              <div className="space-y-2 text-xs font-mono mt-3">
                {[
                  ['ID Firestore', meeting.id],
                  ['Client', meeting.clientName || '—'],
                  ['Clé licence', meeting.licenseKey || '—'],
                  ['Version Lucy', meeting.lucyVersion || '—'],
                  ['Nextcloud', meeting.nextcloudPath || '—'],
                  ['Synchronisé', fmt(meeting.syncedAt)],
                  ['Créé', fmt(meeting.createdAt)],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 py-1.5 border-b border-white/[0.04]">
                    <span className="text-ink-tertiary w-32 flex-shrink-0">{k}</span>
                    <span className="text-ink-secondary break-all">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Summary / Transcript / Actions */}
        <div>
          <div className="bg-dark-surface border border-white/[0.06] rounded-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/[0.06]">
              {([
                ['resume', 'Résumé'],
                ['transcription', `Transcription${transcriptSegments.length > 0 ? ` (${transcriptSegments.length})` : ''}`],
                ['actions', `Actions${actionItems.length > 0 ? ` (${actionItems.length})` : ''}`],
              ] as [typeof tab, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`px-5 py-3 text-sm transition-colors border-b-2 ${tab === key
                    ? 'text-ink-primary font-medium border-brand-teal'
                    : 'text-ink-tertiary border-transparent hover:text-ink-secondary'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="p-5 max-h-[600px] overflow-y-auto">
              {/* ─── RESUME TAB ─── */}
              {tab === 'resume' && (
                <div className="space-y-5">
                  {/* Sentiment */}
                  {sentiment && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium capitalize"
                      style={{ background: `${sentimentColor}18`, color: sentimentColor, border: `1px solid ${sentimentColor}30` }}>
                      {sentiment}
                    </span>
                  )}

                  {/* Executive summary */}
                  {execSummary && (
                    <div className="text-sm text-ink-secondary leading-relaxed p-3 bg-brand-purple/[0.06] border-l-[3px] border-brand-purple rounded-r-lg">
                      {execSummary}
                    </div>
                  )}

                  {/* Topics */}
                  {topics.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">Sujets abordés</h3>
                      <div className="space-y-1">
                        {topics.map((t, i) => (
                          <div key={i} className="flex items-baseline gap-2 p-2 bg-white/[0.02] rounded-md">
                            <span className="text-sm font-medium text-ink-primary">{t.topic}</span>
                            {t.duration && (
                              <span className="text-[10px] text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded font-mono">{t.duration}</span>
                            )}
                            {t.summary && <span className="text-xs text-ink-tertiary flex-1">{t.summary}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key points */}
                  {keyPoints.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">Points clés</h3>
                      <div className="space-y-1.5">
                        {keyPoints.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                            <ChevronRight className="w-3 h-3 text-brand-purple flex-shrink-0 mt-1" />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Decisions */}
                  {decisions.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">Décisions</h3>
                      <div className="space-y-1.5">
                        {decisions.map((d, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                            <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-1" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next steps */}
                  {nextSteps.length > 0 && (
                    <div>
                      <h3 className="text-[11px] font-semibold text-ink-tertiary uppercase tracking-wider mb-2">Prochaines étapes</h3>
                      <div className="space-y-1.5">
                        {nextSteps.map((ns, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                            <Zap className="w-3 h-3 text-amber-400 flex-shrink-0 mt-1" />
                            <span>{ns}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fallback: plain text */}
                  {!execSummary && keyPoints.length === 0 && !sentiment && typeof meeting.summary === 'string' && meeting.summary && (
                    <p className="text-sm text-ink-secondary leading-relaxed whitespace-pre-wrap">{meeting.summary}</p>
                  )}
                </div>
              )}

              {/* ─── TRANSCRIPTION TAB ─── */}
              {tab === 'transcription' && (
                <div>
                  {transcriptSegments.length > 0 ? (
                    <div className="space-y-0.5">
                      {transcriptSegments.map((seg, i) => (
                        <div key={i} className="flex gap-3 py-1.5 px-2 rounded hover:bg-white/[0.03] transition-colors">
                          {seg.ts && (
                            <span className="text-[11px] text-brand-purple font-mono opacity-70 min-w-[40px] flex-shrink-0 pt-0.5">
                              {seg.ts}
                            </span>
                          )}
                          {seg.speaker && (
                            <span className="text-[11px] text-emerald-400 min-w-[55px] flex-shrink-0 font-medium">
                              {seg.speaker}
                            </span>
                          )}
                          <span className="text-sm text-ink-secondary leading-relaxed">{seg.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : meeting.transcript ? (
                    <p className="text-sm text-ink-tertiary leading-relaxed whitespace-pre-wrap font-mono">{meeting.transcript}</p>
                  ) : (
                    <p className="text-sm text-ink-tertiary text-center py-8">Aucune transcription disponible.</p>
                  )}
                </div>
              )}

              {/* ─── ACTIONS TAB ─── */}
              {tab === 'actions' && (
                <div>
                  {actionItems.length > 0 ? (
                    <div className="space-y-2">
                      {actionItems.map((a, i) => {
                        const item: { task: string; owner?: string; deadline?: string; priority?: string } =
                          typeof a === 'string' ? { task: a } : a as { task: string; owner?: string; deadline?: string; priority?: string }
                        return (
                          <div key={i} className="flex gap-3 p-3 bg-white/[0.02] rounded-lg">
                            <div className="w-5 h-5 rounded-full border-2 border-brand-purple flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-ink-primary mb-1">{item.task}</p>
                              <div className="flex gap-3 text-[11px]">
                                {item.owner && <span className="text-emerald-400">→ {item.owner}</span>}
                                {item.deadline && <span className="text-amber-400">⏰ {item.deadline}</span>}
                                {item.priority && (
                                  <span className={`uppercase tracking-wider font-semibold text-[10px] ${
                                    item.priority === 'high' ? 'text-red-400' :
                                    item.priority === 'medium' ? 'text-amber-400' : 'text-ink-tertiary'
                                  }`}>{item.priority}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-ink-tertiary text-center py-8">Aucune action identifiée.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error toast */}
      {err && meeting && (
        <div className="fixed bottom-6 right-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm shadow-xl">
          {err}
        </div>
      )}
    </div>
  )
}
