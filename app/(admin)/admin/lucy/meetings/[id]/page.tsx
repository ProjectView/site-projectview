'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Mic, ArrowLeft, Clock, Users, Globe, Monitor,
  FileText, ListChecks, Play, Pause, Download, ExternalLink
} from 'lucide-react'

interface Meeting {
  id: string; title: string; date: string; duration: number
  participants: string[]; clientName: string; deviceName: string
  summary: string; transcript: string
  audioUrl: string; cameraUrl: string; screenUrl: string
  nextcloudPath: string; language: string
  licenseKey: string; lucyVersion: string
  createdAt: string | null; syncedAt: string | null
}

interface StructuredSummary {
  title?: string
  summary?: string
  actions?: string[]
  participants?: string[]
  [key: string]: unknown
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

function AudioPlayer({ url, label }: { url: string; label: string }) {
  const [playing, setPlaying] = useState(false)
  const [audio] = useState(() => typeof window !== 'undefined' ? new Audio(url) : null)

  useEffect(() => {
    if (!audio) return
    audio.onended = () => setPlaying(false)
    return () => { audio.pause(); audio.src = '' }
  }, [audio])

  function toggle() {
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
      <button onClick={toggle}
        className="w-9 h-9 rounded-full bg-brand-teal/20 flex items-center justify-center hover:bg-brand-teal/30 transition-colors flex-shrink-0">
        {playing
          ? <Pause className="w-4 h-4 text-brand-teal" />
          : <Play  className="w-4 h-4 text-brand-teal ml-0.5" />}
      </button>
      <span className="text-sm text-ink-secondary flex-1">{label}</span>
      <a href={url} target="_blank" rel="noreferrer"
        className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
        <Download className="w-4 h-4 text-ink-tertiary" />
      </a>
    </div>
  )
}

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [showRaw, setShowRaw] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/lucy/meetings/${id}`)
      .then(r => r.ok ? r.json() : r.json().then((j: {error:string}) => { throw new Error(j.error) }))
      .then(setMeeting)
      .catch((e: Error) => setErr(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="h-6 w-48 bg-white/[0.04] rounded animate-pulse mb-8" />
      <div className="space-y-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/[0.04] rounded-xl animate-pulse" />)}
      </div>
    </div>
  )

  if (err) return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-ink-tertiary hover:text-ink-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">{err}</div>
    </div>
  )

  if (!meeting) return null

  const structured = parseSummary(meeting.summary)
  const plainSummary = structured?.summary ?? (typeof meeting.summary === 'string' ? meeting.summary : '')
  const actions: string[] = structured?.actions ?? []
  const hasAudio  = !!meeting.audioUrl
  const hasCamera = !!meeting.cameraUrl
  const hasScreen = !!meeting.screenUrl

  return (
    <div className="p-6 max-w-4xl mx-auto pb-16">
      {/* Back */}
      <button onClick={() => router.push('/admin/lucy/meetings')}
        className="flex items-center gap-2 text-sm text-ink-tertiary hover:text-ink-primary transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Toutes les réunions
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center flex-shrink-0 mt-1">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-ink-primary mb-1">{meeting.title || 'Sans titre'}</h1>
          <p className="text-sm text-ink-tertiary">{fmt(meeting.date)}</p>
        </div>
      </div>

      {/* Meta cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Clock,   label: 'Durée',        value: dur(meeting.duration) },
          { icon: Users,   label: 'Participants',  value: String(meeting.participants?.length || 0) },
          { icon: Globe,   label: 'Langue',        value: meeting.language?.toUpperCase() || '—' },
          { icon: Monitor, label: 'Device',        value: meeting.deviceName || '—' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-dark-surface border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className="w-3.5 h-3.5 text-ink-tertiary" />
              <span className="text-xs text-ink-tertiary">{label}</span>
            </div>
            <span className="text-sm font-semibold text-ink-primary">{value}</span>
          </div>
        ))}
      </div>

      {/* Participants */}
      {meeting.participants?.length > 0 && (
        <div className="bg-dark-surface border border-white/[0.06] rounded-xl p-5 mb-6">
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

      {/* Summary */}
      {plainSummary && (
        <div className="bg-dark-surface border border-white/[0.06] rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-ink-secondary mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Résumé
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed whitespace-pre-wrap">{plainSummary}</p>
        </div>
      )}

      {/* Actions / TODOs */}
      {actions.length > 0 && (
        <div className="bg-dark-surface border border-white/[0.06] rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-ink-secondary mb-3 flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> Points d&apos;action
          </h2>
          <ul className="space-y-2">
            {actions.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs text-brand-purple font-bold">{i + 1}</span>
                <span className="text-sm text-ink-secondary">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Audio / Media */}
      {(hasAudio || hasCamera || hasScreen) && (
        <div className="bg-dark-surface border border-white/[0.06] rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-ink-secondary mb-3 flex items-center gap-2">
            <Play className="w-4 h-4" /> Médias
          </h2>
          <div className="space-y-2">
            {hasAudio  && <AudioPlayer url={meeting.audioUrl}  label="Audio de la réunion" />}
            {hasCamera && <AudioPlayer url={meeting.cameraUrl} label="Caméra" />}
            {hasScreen && (
              <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
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

      {/* Transcript */}
      {meeting.transcript && (
        <div className="bg-dark-surface border border-white/[0.06] rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-ink-secondary mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Transcription complète
          </h2>
          <div className="max-h-96 overflow-y-auto pr-2">
            <p className="text-sm text-ink-tertiary leading-relaxed whitespace-pre-wrap font-mono">
              {meeting.transcript}
            </p>
          </div>
        </div>
      )}

      {/* Metadata footer */}
      <div className="bg-dark-surface border border-white/[0.06] rounded-xl p-5">
        <button onClick={() => setShowRaw(v => !v)}
          className="flex items-center gap-2 text-xs text-ink-tertiary hover:text-ink-secondary transition-colors mb-3">
          <span>{showRaw ? '▾' : '▸'}</span> Métadonnées techniques
        </button>
        {showRaw && (
          <div className="space-y-2 text-xs font-mono">
            {[
              ['ID Firestore', meeting.id],
              ['Client',       meeting.clientName || '—'],
              ['Clé licence',  meeting.licenseKey || '—'],
              ['Version Lucy', meeting.lucyVersion || '—'],
              ['Nextcloud',    meeting.nextcloudPath || '—'],
              ['Synchronisé',  fmt(meeting.syncedAt)],
              ['Créé',         fmt(meeting.createdAt)],
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
  )
}
