/**
 * POST /api/lucy/transcribe-gladia
 *
 * Proxy Gladia Paris — transcription cloud avec diarisation native.
 * Remplace /transcribe (OpenAI Whisper) quand FEATURES.GLADIA_TRANSCRIPTION = true.
 *
 * Auth   : header `x-lucy-key: <licenceKey>`
 * Body   : multipart/form-data
 *            audio        — fichier audio (webm, wav, mp3 …) ≤ 200 Mo
 *            language     — ISO 639-1, défaut "fr"
 *            diarization  — "true" | "false", défaut "true"
 *
 * Réponse 200 :
 *   { text, textWithSpeakers, language, segments[], speakerCount }
 *
 * Spec complète : docs/PULSE-GLADIA-ROUTE.md
 * Déployer dans : site-pv-temp/app/api/lucy/transcribe-gladia/route.ts
 */

import { NextResponse } from 'next/server'
import { findLicenseByKey } from '@/lib/lucy-licenses'
import { getAdminFirestore } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 min max (Netlify Functions pro)

const GLADIA_API = 'https://api.gladia.io/v2'
const MAX_SIZE_BYTES = 200 * 1024 * 1024 // 200 Mo

// ── Helpers ────────────────────────────────────────────────────────────────────

function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function fmtTs(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function buildSpeakerTranscript(
  segments: Array<{ text: string; speaker?: string }>
): string {
  const hasAny = segments.some((s) => !!s.speaker)
  if (!hasAny) return segments.map((s) => s.text.trim()).join(' ')
  const lines: string[] = []
  let curSpeaker: string | undefined
  let curText = ''
  for (const seg of segments) {
    if (seg.speaker !== curSpeaker) {
      if (curText) lines.push(`${curSpeaker ?? 'Locuteur_inconnu'}: ${curText.trim()}`)
      curSpeaker = seg.speaker
      curText = seg.text.trim()
    } else {
      curText += ' ' + seg.text.trim()
    }
  }
  if (curText) lines.push(`${curSpeaker ?? 'Locuteur_inconnu'}: ${curText.trim()}`)
  return lines.join('\n')
}

function normalizeGladiaResult(rawResult: unknown, language: string) {
  const result = rawResult as {
    transcription?: {
      full_transcript?: string
      utterances?: Array<{
        start: number
        end: number
        text: string
        speaker?: number | string | null
      }>
    }
  }
  const utterances = result?.transcription?.utterances ?? []
  const fullText =
    result?.transcription?.full_transcript ??
    utterances.map((u) => u.text.trim()).join(' ')
  const speakerSet = new Set<string>()
  const segments = utterances.map((u) => {
    const label =
      u.speaker !== undefined && u.speaker !== null
        ? `Speaker_${String.fromCharCode(65 + (Number(u.speaker) % 26))}`
        : undefined
    if (label) speakerSet.add(label)
    return { start: u.start, end: u.end, startTs: fmtTs(u.start), endTs: fmtTs(u.end), text: u.text.trim(), speaker: label }
  })
  return { text: fullText.trim(), textWithSpeakers: buildSpeakerTranscript(segments), language, segments, speakerCount: speakerSet.size }
}

async function pollGladia(resultUrl: string, gladiaKey: string, timeoutMs = 30 * 60 * 1000): Promise<unknown | null> {
  const deadline = Date.now() + timeoutMs
  let delay = 3000
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, delay))
    if (Date.now() - (deadline - timeoutMs) > 30_000) delay = Math.min(delay + 2000, 10_000)
    const res = await fetch(resultUrl, { headers: { 'x-gladia-key': gladiaKey } })
    if (!res.ok) continue
    const poll = (await res.json()) as { status: string; result?: unknown; error_code?: string }
    if (poll.status === 'error') throw new Error(`Gladia error: ${poll.error_code ?? 'unknown'}`)
    if (poll.status === 'done') return poll.result
  }
  return null
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // 1) Auth licence
    const licenseKey = request.headers.get('x-lucy-key')?.trim()
    if (!licenseKey) {
      return NextResponse.json({ error: 'unauthorized', reason: 'x-lucy-key manquant' }, { status: 401 })
    }
    const license = await findLicenseByKey(licenseKey)
    if (!license) {
      return NextResponse.json({ error: 'unauthorized', reason: 'licence invalide' }, { status: 401 })
    }
    if (license.status === 'expired' || license.status === 'revoked') {
      return NextResponse.json({ error: 'unauthorized', reason: 'licence expirée/révoquée' }, { status: 401 })
    }
    if (license.status === 'suspended') {
      return NextResponse.json({ error: 'forbidden', reason: 'licence suspendue' }, { status: 403 })
    }

    // 2) Vérif quota mensuel
    const db = getAdminFirestore()
    const month = currentMonth()
    const limit: number | null =
      (license.features as { maxMeetingsPerMonth?: number | null })?.maxMeetingsPerMonth ?? null
    if (limit !== null) {
      const usageDoc = await db.collection('meetingUsage').doc(`${license.id}_${month}`).get()
      const used: number = usageDoc.exists ? (usageDoc.data()?.count ?? 0) : 0
      if (used >= limit) {
        return NextResponse.json({ error: 'quota_exceeded', used, limit }, { status: 429 })
      }
    }

    // 3) Clé Gladia
    const gladiaKey = process.env.GLADIA_API_KEY
    if (!gladiaKey) {
      return NextResponse.json({ error: 'gladia_not_configured' }, { status: 503 })
    }

    // 4) Parse multipart
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null
    const language = (formData.get('language') as string | null) || 'fr'
    const diarization = (formData.get('diarization') as string | null) !== 'false'
    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json({ error: 'missing_audio' }, { status: 400 })
    }
    if (audioFile.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'payload_too_large' }, { status: 413 })
    }

    // 5) Upload vers Gladia
    const uploadForm = new FormData()
    uploadForm.append('audio', audioFile, audioFile.name || 'audio.webm')
    const uploadRes = await fetch(`${GLADIA_API}/upload`, {
      method: 'POST',
      headers: { 'x-gladia-key': gladiaKey },
      body: uploadForm,
    })
    if (!uploadRes.ok) {
      console.error('[transcribe-gladia] upload error:', uploadRes.status, await uploadRes.text().catch(() => ''))
      return NextResponse.json({ error: 'gladia_error', upstream_status: uploadRes.status }, { status: 502 })
    }
    const { audio_url } = (await uploadRes.json()) as { audio_url: string }

    // 6) Soumettre le job
    const jobRes = await fetch(`${GLADIA_API}/pre-recorded`, {
      method: 'POST',
      headers: { 'x-gladia-key': gladiaKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio_url,
        diarization,
        diarization_config: { min_speakers: 1, max_speakers: 6 },
        language_config: { languages: [language], code_switching: false },
        punctuation_enhanced: true,
      }),
    })
    if (!jobRes.ok) {
      console.error('[transcribe-gladia] job error:', jobRes.status, await jobRes.text().catch(() => ''))
      return NextResponse.json({ error: 'gladia_error', upstream_status: jobRes.status }, { status: 502 })
    }
    const jobData = (await jobRes.json()) as { id: string; result_url: string }

    // 7) Poll résultat
    const rawResult = await pollGladia(jobData.result_url, gladiaKey)
    if (!rawResult) {
      return NextResponse.json({ error: 'gladia_timeout' }, { status: 504 })
    }

    // 8) Normaliser au format Lucy
    const response = normalizeGladiaResult(rawResult, language)

    // 9) Incrément quota (fire-and-forget)
    db.collection('meetingUsage')
      .doc(`${license.id}_${month}`)
      .set({ licenseId: license.id, month, count: FieldValue.increment(1) }, { merge: true })
      .catch((e) => console.warn('[transcribe-gladia] quota increment failed:', e))

    return NextResponse.json(response)
  } catch (err) {
    console.error('[API /lucy/transcribe-gladia]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
