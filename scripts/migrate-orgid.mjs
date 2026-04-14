#!/usr/bin/env node
/**
 * Migration one-shot — Backfill orgId sur licenses + meetings
 *
 * Logique :
 *   1) Pour chaque licence sans orgId :
 *        - Tente de matcher license.clientName (case-insensitive) avec organizations.name
 *        - Si match unique → stamp orgId
 *        - Sinon → laissée orpheline (logged dans le CSV)
 *   2) Pour chaque meeting sans orgId :
 *        - Lookup licence par licenseKey → stamp licence.orgId (même si null)
 *   3) Écrit un rapport CSV : scripts/migration-orgid-report-<timestamp>.csv
 *
 * Idempotent : ne touche que les docs sans orgId (ou avec orgId=null pour meetings).
 *
 * Usage :
 *   node scripts/migrate-orgid.mjs            # dry-run (par défaut)
 *   node scripts/migrate-orgid.mjs --apply    # applique les écritures
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// --- Args ---
const APPLY = process.argv.includes('--apply')

// --- Charger .env.local ---
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')
try {
  const env = readFileSync(envPath, 'utf-8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (!m) continue
    let [, k, v] = m
    v = v.trim().replace(/^"(.*)"$/s, '$1')
    if (!process.env[k]) process.env[k] = v
  }
} catch {
  console.warn('⚠️  .env.local non trouvé — on suppose que les vars sont exportées.')
}

// --- Init Firebase Admin ---
const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
if (!projectId || !clientEmail || !privateKey) {
  console.error('❌ Variables Firebase Admin manquantes dans .env.local')
  process.exit(1)
}
if (getApps().length === 0) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}
const db = getFirestore()

console.log(`\n=== Migration orgId — mode : ${APPLY ? 'APPLY (écriture)' : 'DRY-RUN (lecture seule)'} ===\n`)

// --- 1) Charger toutes les organisations en mémoire ---
const orgsSnap = await db.collection('organizations').get()
const orgsByNameLower = new Map()
for (const d of orgsSnap.docs) {
  const data = d.data()
  if (data.name) orgsByNameLower.set(String(data.name).trim().toLowerCase(), d.id)
}
console.log(`• ${orgsSnap.size} organisations chargées.`)

// --- 2) Traiter les licences ---
const licSnap = await db.collection('licenses').get()
console.log(`• ${licSnap.size} licences au total.\n`)

const report = [] // rows CSV
report.push(['type', 'id', 'key', 'clientName', 'action', 'orgId', 'note'].join(','))

let licAlreadyScoped = 0
let licMatched = 0
let licOrphan = 0
const licWrites = []

// Cache licenceId → orgId pour l'étape meetings
const licOrgCache = new Map()

for (const doc of licSnap.docs) {
  const data = doc.data()
  const id = doc.id
  const key = data.key || data.licenseKey || ''
  const clientName = (data.clientName || '').trim()
  const csvClient = `"${clientName.replace(/"/g, '""')}"`

  if (data.orgId) {
    licAlreadyScoped++
    licOrgCache.set(key, data.orgId)
    continue
  }

  const match = clientName ? orgsByNameLower.get(clientName.toLowerCase()) : null
  if (match) {
    licMatched++
    licOrgCache.set(key, match)
    licWrites.push({ ref: doc.ref, orgId: match })
    report.push(['license', id, key, csvClient, 'matched', match, ''].join(','))
  } else {
    licOrphan++
    licOrgCache.set(key, null)
    report.push(['license', id, key, csvClient, 'orphan', '', 'no matching org — needs manual assignment'].join(','))
  }
}

console.log(`  - déjà scopées  : ${licAlreadyScoped}`)
console.log(`  - matchées      : ${licMatched}`)
console.log(`  - orphelines    : ${licOrphan}\n`)

if (APPLY && licWrites.length) {
  console.log(`  Écriture de ${licWrites.length} licences...`)
  let batch = db.batch()
  let n = 0
  for (const w of licWrites) {
    batch.update(w.ref, { orgId: w.orgId })
    n++
    if (n % 400 === 0) { await batch.commit(); batch = db.batch() }
  }
  if (n % 400 !== 0) await batch.commit()
  console.log(`  ✓ ${licWrites.length} licences mises à jour.\n`)
}

// --- 3) Traiter les meetings ---
const mtgSnap = await db.collection('meetings').get()
console.log(`• ${mtgSnap.size} meetings au total.`)

let mtgAlreadyScoped = 0
let mtgMatched = 0
let mtgOrphan = 0
const mtgWrites = []

for (const doc of mtgSnap.docs) {
  const data = doc.data()
  const id = doc.id
  const licKey = data.licenseKey || ''
  const title = (data.title || '').replace(/"/g, '""').slice(0, 80)

  if (data.orgId != null) {
    mtgAlreadyScoped++
    continue
  }

  // Lookup orgId via licence (cache peuplé à l'étape 2)
  let orgId = licOrgCache.has(licKey) ? licOrgCache.get(licKey) : undefined

  // Si pas dans le cache (licence externe ou supprimée), on va chercher en DB
  if (orgId === undefined && licKey) {
    const q = await db.collection('licenses').where('key', '==', licKey).limit(1).get()
    if (!q.empty) {
      orgId = q.docs[0].data().orgId ?? null
      licOrgCache.set(licKey, orgId)
    } else {
      orgId = null
    }
  }

  if (orgId) {
    mtgMatched++
    mtgWrites.push({ ref: doc.ref, orgId })
    report.push(['meeting', id, licKey, `"${title}"`, 'matched', orgId, ''].join(','))
  } else {
    mtgOrphan++
    report.push(['meeting', id, licKey, `"${title}"`, 'orphan', '', 'license has no orgId'].join(','))
  }
}

console.log(`  - déjà scopés   : ${mtgAlreadyScoped}`)
console.log(`  - matchés       : ${mtgMatched}`)
console.log(`  - orphelins     : ${mtgOrphan}\n`)

if (APPLY && mtgWrites.length) {
  console.log(`  Écriture de ${mtgWrites.length} meetings...`)
  let batch = db.batch()
  let n = 0
  for (const w of mtgWrites) {
    batch.update(w.ref, { orgId: w.orgId })
    n++
    if (n % 400 === 0) { await batch.commit(); batch = db.batch() }
  }
  if (n % 400 !== 0) await batch.commit()
  console.log(`  ✓ ${mtgWrites.length} meetings mis à jour.\n`)
}

// --- 4) Écrire le rapport CSV ---
const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const csvPath = join(__dirname, `migration-orgid-report-${ts}.csv`)
writeFileSync(csvPath, report.join('\n'), 'utf-8')
console.log(`📄 Rapport CSV : ${csvPath}`)
console.log(`   ${report.length - 1} lignes de rapport\n`)

if (!APPLY) {
  console.log('ℹ️  Dry-run terminé. Relance avec --apply pour appliquer les écritures.')
} else {
  console.log('✅ Migration terminée.')
}
