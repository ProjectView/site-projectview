import { NextResponse } from 'next/server'
import { findLicenseByKey } from '@/lib/lucy-licenses'

// POST /api/lucy/summarize — Resume IA via Anthropic Haiku, auth x-lucy-key
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

    const allowedModes = license.features?.allowedModes ?? []
    if (!allowedModes.includes('online') && !allowedModes.includes('hybrid')) {
      return NextResponse.json(
        { error: 'Mode cloud non autorise sur cette licence.' },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { transcript, language = 'fr', meetingTitle = 'Reunion' } = body

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'transcript requis (string).' }, { status: 400 })
    }

    const systemPrompt =
      language === 'fr'
        ? 'Tu es un assistant specialise dans la redaction de comptes-rendus de reunion professionnels. Sois concis, structure et factuel. Reponds UNIQUEMENT en JSON valide.'
        : 'You are an assistant specialized in writing professional meeting minutes. Be concise, structured and factual. Reply ONLY with valid JSON.'

    const userPrompt =
      'Transcription de la reunion "' + meetingTitle + '":\n\n' +
      transcript.slice(0, 14000) +
      '\n\nGenere un compte-rendu JSON avec exactement ces champs :\n{\n  "summary": "...",\n  "keyPoints": ["..."],\n  "actionItems": ["..."],\n  "decisions": ["..."],\n  "nextSteps": "..."\n}'

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    const aiData = await anthropicRes.json()

    if (!anthropicRes.ok) {
      console.error('[/api/lucy/summarize] Anthropic error:', aiData)
      return NextResponse.json(
        { error: aiData?.error?.message ?? 'Erreur Anthropic.' },
        { status: anthropicRes.status },
      )
    }

    const rawText: string =
      aiData?.content?.[0]?.type === 'text' ? aiData.content[0].text : ''

    let parsed: Record<string, unknown>
    try {
      const jsonMatch = rawText.match(/{[\s\S]*}/)
      parsed = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : { summary: rawText, keyPoints: [], actionItems: [], decisions: [], nextSteps: '' }
    } catch {
      parsed = { summary: rawText, keyPoints: [], actionItems: [], decisions: [], nextSteps: '' }
    }

    return NextResponse.json({ success: true, ...parsed })
  } catch (err) {
    console.error('[/api/lucy/summarize] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 })
  }
}
