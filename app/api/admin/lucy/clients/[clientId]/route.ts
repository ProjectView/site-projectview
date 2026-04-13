import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore, checkAdminSession } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Params = { params: { clientId: string } }

const ALLOWED_FIELDS = [
  'company', 'contactName', 'email', 'phone',
  'address', 'city', 'postalCode', 'country',
  'siret', 'vatNumber', 'billingEmail',
  'billingAddress', 'billingCity', 'billingPostalCode',
  'paymentTerms', 'paymentMethod', 'notes',
]

async function getOrCreateClientDoc(db: FirebaseFirestore.Firestore, clientName: string) {
  const snap = await db.collection('lucy_clients').where('name', '==', clientName).limit(1).get()
  if (!snap.empty) {
    const doc = snap.docs[0]
    return { id: doc.id, ...doc.data() } as Record<string, unknown> & { id: string }
  }
  // Create stub
  const ref = await db.collection('lucy_clients').add({
    name: clientName,
    company: '', contactName: '', email: '', phone: '',
    address: '', city: '', postalCode: '', country: 'France',
    siret: '', vatNumber: '', billingEmail: '',
    billingAddress: '', billingCity: '', billingPostalCode: '',
    paymentTerms: '', paymentMethod: '',
    notes: '',
    createdAt: new Date(), updatedAt: new Date(),
  })
  const doc = await ref.get()
  return { id: ref.id, ...doc.data() } as Record<string, unknown> & { id: string }
}

export async function GET(request: NextRequest, { params }: Params) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  const clientName = decodeURIComponent(params.clientId)
  const db = getAdminFirestore()

  try {
    const profile = await getOrCreateClientDoc(db, clientName)

    // Licences liées à ce client
    const licSnap = await db.collection('licenses')
      .where('clientName', '==', clientName).get()

    // Stats meetings par licenseKey
    const meetingsSnap = await db.collection('meetings')
      .select('licenseKey', 'date').get()
    const meetingCounts: Record<string, number> = {}
    const lastMeeting: Record<string, string> = {}
    meetingsSnap.docs.forEach(d => {
      const { licenseKey, date } = d.data()
      if (!licenseKey) return
      meetingCounts[licenseKey] = (meetingCounts[licenseKey] ?? 0) + 1
      if (!lastMeeting[licenseKey] || date > lastMeeting[licenseKey]) {
        lastMeeting[licenseKey] = date
      }
    })

    const licenses = licSnap.docs.map(d => {
      const data = d.data()
      const key = data.key || data.licenseKey || ''
      return {
        id: d.id,
        licenseKey: key,
        screenName: data.screenName || data.deviceName || '—',
        deviceOS: data.deviceOS || '',
        type: data.type || 'trial',
        status: data.status || 'active',
        email: data.email || '',
        fingerprint: data.fingerprint || '',
        expiresAt: data.expiresAt?.toDate?.()?.toISOString() ?? data.expiresAt ?? null,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? null,
        meetingCount: meetingCounts[key] ?? 0,
        lastMeeting: lastMeeting[key] ?? null,
      }
    })

    return NextResponse.json({ profile, licenses })
  } catch (err) {
    console.error('[lucy/clients/[clientId] GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authError = await checkAdminSession(request)
  if (authError) return authError

  const clientName = decodeURIComponent(params.clientId)
  const db = getAdminFirestore()

  try {
    const body = await request.json()
    const update: Record<string, unknown> = { updatedAt: new Date() }
    for (const field of ALLOWED_FIELDS) {
      if (field in body) update[field] = body[field]
    }

    const snap = await db.collection('lucy_clients')
      .where('name', '==', clientName).limit(1).get()

    if (snap.empty) {
      await db.collection('lucy_clients').add({
        name: clientName,
        company: '', contactName: '', email: '', phone: '',
        address: '', city: '', postalCode: '', country: 'France',
        siret: '', vatNumber: '', billingEmail: '',
        billingAddress: '', billingCity: '', billingPostalCode: '',
        paymentTerms: '', paymentMethod: '',
        notes: '',
        createdAt: new Date(),
        ...update,
      })
    } else {
      await snap.docs[0].ref.update(update)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[lucy/clients/[clientId] PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
