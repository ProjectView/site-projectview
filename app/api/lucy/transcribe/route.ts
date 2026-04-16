import { NextResponse } from 'next/server'
import { findLicenseByKey } from '@/lib/lucy-licenses'

// POST /api/lucy/transcribe — Proxy OpenAI Whisper, auth x-lucy-key
export async function POST(request: Request) {
  try {
    const licenseKey = request.headers.get('x-lucy-key')
    if (!licenseKey) {
      return NextResponse.json({ error: 'x-lucy-key manquant.' }, { status: 401 })
    }

    const license = await findLicenseByKey(licenseKey)
    if (!license) {
      return NextResponse.json({ error: 'Licence introuvable.' }, { status: 403 })
    }
    if (license.status !== 'active') {
      return NextResponse.json({ error: `Licence ${license.status}.` }, { status: 403 })
    }
    const expTs = license.expiresAt ? new Date(license.expiresAt).getTime() : 0
    if (expTs < Date.now()) {
      return NextResponse.json({ error: 'Licence expiree.' }, { status: 403 })
    }

    // Vérifier que le mode online/hybrid est autorisé sur cette licence
    const allowedModes = license.features?.allowedModes ?? []
    if (!allowedModes.includes('online') && !allowedModes.includes('hybrid')) {
      return NextResponse.json(
        { error: 'Mode cloud non autorise sur cette licence.' },
        { status: 403 },
      )
    }

    // Transmettre le FormData audio directement à OpenAI Whisper
    const formData = await request.formData()
    if (!formData.has('model')) {
      formData.set('model', 'whisper-1')
    }

    const openaiRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    })

    const data = await openaiRes.json()

    if (!openaiRes.ok) {
      console.error('[/api/lucy/transcribe] OpenAI error:', data)
      return NextResponse.json(
        { error: data?.error?.message ?? 'Erreur OpenAI.' },
        { status: openaiRes.status },
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[/api/lucy/transcribe] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 })
  }
}
