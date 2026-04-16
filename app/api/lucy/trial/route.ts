import { NextResponse } from 'next/server'
import { Timestamp } from 'firebase-admin/firestore'
import { getAdminFirestore } from '@/lib/firebase-admin'
import {
  generateLicenseKey,
  trialExistsForFingerprint,
  trialExistsForEmail,
  upsertDevice,
  notifyN8N,
  DEFAULT_FEATURES,
  TRIAL_DURATION_DAYS,
} from '@/lib/lucy-licenses'

// POST /api/lucy/trial — Creation licence d'essai 30 jours
export async function POST(request: Request) {
  try {
/**
 * POST /api/lucy/trial
  *
   * Crée ou récupère une licence d'essai Lucy liée au fingerprint matériel.
    *
     * ── Comportement idempotent ───────────────────────────────────────────────
      * Si le fingerprint est déjà enregistré avec une licence active (trial ou autre),
       * on retourne la licence existante au lieu de créer un doublon.
        * → Permet les réinstallations légitimes sans intervention manuelle.
         *
          * Body :
           *  { fingerprint, deviceName, deviceOS, email, clientName, screenName }
            *
             * Réponse :
              *  { licenseKey, expiresAt, features, reused?: true }
               */
    
    import { NextResponse } from 'next/server'
      import { getAdminFirestore } from '@/lib/firebase-admin'
        import { PLAN_FEATURES } from '@/lib/lucy-licenses'
          import crypto from 'crypto'
            
    export const runtime = 'nodejs'
      export const dynamic = 'force-dynamic'
        
    const TRIAL_DURATION_DAYS = 30
      
    export async function POST(request: Request) {
        try {
              const body = await request.json() as {
                      fingerprint: string
                      deviceName?: string
                      deviceOS?: string
                      email?: string
                      clientName?: string
                      screenName?: string
              }
                
              const { fingerprint, deviceName, deviceOS, email, clientName, screenName } = body
                
              if (!fingerprint || fingerprint === 'unknown') {
                      return NextResponse.json({ error: 'Fingerprint requis' }, { status: 400 })
              }
          
              const db = getAdminFirestore()
                
              // ── Chercher une licence existante pour ce fingerprint ────────────────
              const existing = await db
                      .collection('lucyLicenses')
                      .where('fingerprint', '==', fingerprint)
                      .limit(1)
                      .get()
                
              if (!existing.empty) {
                      const doc = existing.docs[0]
                              const data = doc.data()
                                
                      // Licence révoquée → refus
                      if (data.status === 'revoked') {
                                return NextResponse.json(
                                  { error: 'Cet appareil a été révoqué. Contactez support@projectview.fr' },
                                  { status: 403 }
                                          )
                      }
                
                      // Licence expirée → proposer renouvellement (pour l'instant on réactive)
                      // En production : rediriger vers la page d'achat
                      const isExpired = data.expiresAt && new Date(data.expiresAt) < new Date()
                              if (isExpired && data.type === 'trial') {
                                        return NextResponse.json(
                                          { error: 'Votre essai de 30 jours est terminé. Choisissez un plan sur projectview.fr/lucy' },
                                          { status: 402 }  // Payment Required
                                                  )
                              }
                
                      // ── Licence active trouvée : retourner sans recréer ─────────────────
                      // Mettre à jour screenName/deviceName si fournis (réinstallation)
                      if (screenName || deviceName) {
                                await doc.ref.update({
                                            ...(screenName && { screenName }),
                                            ...(deviceName && { deviceName }),
                                            ...(deviceOS && { deviceOS }),
                                            updatedAt: new Date().toISOString(),
                                })
                      }
                
                      return NextResponse.json({
                                licenseKey: data.key,
                                expiresAt:  data.expiresAt,
                                features:   data.features ?? PLAN_FEATURES.trial,
                                plan:       data.plan ?? 'trial',
                                reused:     true,   // signal au client qu'on a récupéré la licence existante
                      })
              }
          
              // ── Pas de licence existante : créer le trial ─────────────────────────
              const licenseKey = 'LCY-' + crypto.randomBytes(12).toString('hex').toUpperCase()
                    const expiresAt  = new Date(Date.now() + TRIAL_DURATION_DAYS * 86_400_000).toISOString()
                          const now        = new Date().toISOString()
                            
              const licenseDoc = {
                      key:        licenseKey,
                      type:       'trial',
                      status:     'active',
                      plan:       'trial',
                      fingerprint,
                      deviceName: deviceName ?? 'Unknown',
                      deviceOS:   deviceOS   ?? 'Unknown',
                      email:      email      ?? '',
                      clientName: clientName ?? '',
                      screenName: screenName ?? '',
                      features:   PLAN_FEATURES.trial,
                      expiresAt,
                      createdAt:  now,
                      updatedAt:  now,
              }
                
              await db.collection('lucyLicenses').add(licenseDoc)
                
              // Envoyer email de bienvenue (non bloquant)
              if (email) {
                      sendWelcomeEmail(email, clientName ?? '', licenseKey).catch(console.error)
              }
          
              return NextResponse.json({
                      licenseKey,
                      expiresAt,
                      features: PLAN_FEATURES.trial,
                      plan:     'trial',
              })
        } catch (err) {
              console.error('[API /lucy/trial]', err)
                    return NextResponse.json(
                      { error: err instanceof Error ? err.message : 'Erreur serveur' },
                      { status: 500 }
                          )
        }
    }
    
    // ── Email de bienvenue (optionnel) ────────────────────────────────────────
    
    async function sendWelcomeEmail(to: string, clientName: string, licenseKey: string) {
        try {
              const { sendEmail } = await import('@/lib/email')
                    await sendEmail({
                            to,
                            subject: 'Bienvenue sur Lucy — votre clé de licence',
                            html: `
                                    <p>Bonjour${clientName ? ' ' + clientName : ''},</p>
                                            <p>Votre essai Lucy de 30 jours est activé.</p>
                                                    <p><strong>Clé de licence :</strong> <code>${licenseKey}</code></p>
                                                            <p>Conservez cette clé — elle sera nécessaire si vous réinstallez Lucy.</p>
                                                                    <p>— L'équipe ProjectView</p>
                                                                          `,
                    })
        } catch (e) {
              console.warn('[trial] Welcome email failed:', e)
        }
    }const body = await request.json()
    const { fingerprint, deviceName, deviceOS, email, clientName, screenName } = body

    if (!fingerprint || !email || !deviceName) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants : fingerprint, email, deviceName." },
        { status: 400 },
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    if (await trialExistsForFingerprint(fingerprint)) {
      return NextResponse.json(
        { error: "Une licence d'essai existe deja pour cet appareil." },
        { status: 409 },
      )
    }

    if (await trialExistsForEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: "Une licence d'essai existe deja pour cet email." },
        { status: 409 },
      )
    }

    const key = generateLicenseKey()
    const now = Timestamp.now()
    const expiresAt = Timestamp.fromDate(
      new Date(Date.now() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000),
    )

    const db = getAdminFirestore()

    const licenseRef = await db.collection('licenses').add({
      key,
      type: 'trial',
      status: 'active',
      email: normalizedEmail,
      clientName: clientName || '',
      screenName: screenName || '',
      fingerprint,
      deviceName,
      deviceOS: deviceOS || 'unknown',
      createdAt: now,
      activatedAt: now,
      expiresAt,
      lastValidation: null,
      stripeSubscriptionId: null,
      stripeCustomerId: null,
      features: DEFAULT_FEATURES,
    })

    await upsertDevice({
      fingerprint,
      name: screenName || deviceName,
      os: deviceOS || 'unknown',
      licenseId: licenseRef.id,
    })

    notifyN8N('lucy.trial.created', {
      email: normalizedEmail,
      clientName: clientName || '',
      deviceName,
      licenseKey: key,
      expiresAt: expiresAt.toDate().toISOString(),
    }).catch(() => {})

    return NextResponse.json({
      licenseKey: key,
      expiresAt: expiresAt.toDate().toISOString(),
      features: DEFAULT_FEATURES,
    })
  } catch (err) {
    console.error('[/api/lucy/trial] Erreur:', err)
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 })
  }
}
