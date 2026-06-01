#!/usr/bin/env node
/**
 * Migration one-shot — Aligner les licences Lucy/Georgette pour éviter
 * les « erreurs de licence » côté app.
 *
 * Contexte :
 *   L'app attend `features.allowedModes` avec les valeurs 'local' / 'cloud'.
 *   D'anciens docs utilisent encore 'online' / 'hybrid' / 'offline' → l'app
 *   détecte mal le plan (Cloud vu comme Pro, mode cloud bloqué, etc.).
 *
 * Ce que fait le script :
 *   1) Collection `licenses` :
 *      a) normalise `features.allowedModes` ('offline'→'local',
 *         'online'|'hybrid'→'cloud', dédupliqué). Idempotent.
 *      b) remplit `expiresAt` manquant/illisible (createdAt +365j, sinon
 *         maintenant +365j) — sinon /validate marque la licence expirée à tort.
 *         Réactive le `status:'expired'` flippé pour cette raison.
 *   2) Collection `lucyLicenses` (legacy, clés 'LCY-') : RAPPORT SEUL,
 *      aucune écriture. Les nouvelles trials vont déjà dans `licenses`
 *      (fix backend) ; ces devices n'ont qu'à re-trial. Aucune suppression.
 *
 * Sécurité : dry-run par défaut, n'écrit qu'avec --apply, rapport CSV.
 *
 * Usage :
 *   node scripts/migrate-lucy-licenses.mjs            # dry-run (lecture seule)
 *   node scripts/migrate-lucy-licenses.mjs --apply    # applique la normalisation
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

console.log(`\n=== Migration licences Lucy — mode : ${APPLY ? 'APPLY (écriture)' : 'DRY-RUN (lecture seule)'} ===\n`)

// --- Mapping legacy → app ---
const LEGACY = new Set(['online', 'hybrid', 'offline'])
function normalizeModes(modes) {
  // Retourne null si aucun changement nécessaire, sinon le nouveau tableau dédupliqué.
  if (!Array.isArray(modes) || modes.length === 0) return null
  const hasLegacy = modes.some((m) => LEGACY.has(m))
  if (!hasLegacy) return null
  const mapped = new Set()
  for (const m of modes) {
    if (m === 'offline') mapped.add('local')
    else if (m === 'online' || m === 'hybrid') mapped.add('cloud')
    else mapped.add(m) // 'local' / 'cloud' déjà bons : conservés
  }
  // Ordre stable : local avant cloud
  return ['local', 'cloud'].filter((m) => mapped.has(m))
    .concat([...mapped].filter((m) => m !== 'local' && m !== 'cloud'))
}

const report = []
report.push(['collection', 'id', 'key', 'type', 'status', 'before', 'after', 'action'].join(','))

// --- Helper : ms d'une date Firestore (Timestamp) ou string ISO ; NaN si absent/illisible ---
const DEFAULT_VALIDITY_DAYS = 365
function expiryMs(v) {
  if (!v) return NaN
  return v?.toDate ? v.toDate().getTime() : new Date(v).getTime()
}

// --- 1) Corriger `licenses` : allowedModes legacy + expiresAt manquant ---
const licSnap = await db.collection('licenses').get()
console.log(`• ${licSnap.size} docs dans 'licenses'.`)
let changed = 0
for (const doc of licSnap.docs) {
  const data = doc.data()
  const updates = {}
  const actions = []

  // a) Normaliser allowedModes (online/hybrid/offline → local/cloud)
  const beforeModes = data.features?.allowedModes
  const afterModes = normalizeModes(beforeModes)
  if (afterModes) {
    updates['features.allowedModes'] = afterModes
    actions.push(`allowedModes ${JSON.stringify(beforeModes)}->${JSON.stringify(afterModes)}`)
  }

  // b) Remplir expiresAt manquant/illisible (sinon /validate la marque expirée à tort)
  if (!Number.isFinite(expiryMs(data.expiresAt))) {
    const baseMs = Number.isFinite(expiryMs(data.createdAt)) ? expiryMs(data.createdAt) : Date.now()
    const exp = new Date(baseMs + DEFAULT_VALIDITY_DAYS * 86_400_000)
    updates.expiresAt = exp // firebase-admin stocke un Date JS en Timestamp
    actions.push(`expiresAt MANQUANT -> ${exp.toISOString()}`)
    // Réactiver si la licence avait été marquée 'expired' À TORT (faute d'expiresAt)
    if (data.status === 'expired') {
      updates.status = 'active'
      actions.push('status expired->active')
    }
  }

  if (actions.length === 0) continue
  changed++
  updates.updatedAt = new Date().toISOString()
  report.push([
    'licenses', doc.id, data.key ?? '', data.type ?? '', data.status ?? '',
    `"${JSON.stringify(beforeModes ?? null)}"`,
    `"${JSON.stringify(updates['features.allowedModes'] ?? beforeModes ?? null)}"`,
    `"${actions.join(' | ')}"`,
  ].join(','))
  console.log(`  ${APPLY ? '✏️ ' : '→ '} ${data.key ?? doc.id} : ${actions.join(' | ')}`)
  if (APPLY) await doc.ref.update(updates)
}
console.log(`  ${changed} doc(s) ${APPLY ? 'corrigé(s)' : 'à corriger'}.\n`)

// --- 2) Rapport lucyLicenses (read-only) ---
let orphans = 0
try {
  const oldSnap = await db.collection('lucyLicenses').get()
  console.log(`• ${oldSnap.size} docs dans 'lucyLicenses' (legacy, RAPPORT SEUL — aucune écriture).`)
  for (const doc of oldSnap.docs) {
    const data = doc.data()
    orphans++
    report.push([
      'lucyLicenses', doc.id, data.key ?? '', data.type ?? '', data.status ?? '',
      `"${JSON.stringify(data.features?.allowedModes ?? null)}"`, '', 'REPORT_ONLY',
    ].join(','))
  }
  if (orphans) {
    console.log(`  ⚠️  ${orphans} licence(s) orpheline(s) en 'lucyLicenses' (clés probablement 'LCY-').`)
    console.log(`     → non migrées (format incompatible). Ces devices doivent re-trial → ira dans 'licenses'.`)
  }
} catch (e) {
  console.log(`• 'lucyLicenses' : lecture impossible/inexistante (${e.message}).`)
}

// --- Rapport CSV ---
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const outPath = join(__dirname, `migration-lucy-licenses-report-${stamp}.csv`)
writeFileSync(outPath, report.join('\n'), 'utf-8')
console.log(`\n📄 Rapport : ${outPath}`)
console.log(`\n=== Fin — ${APPLY ? 'écritures appliquées' : 'DRY-RUN, aucune écriture'} ===`)
if (!APPLY && changed > 0) {
  console.log(`Relance avec --apply pour corriger les ${changed} licence(s).`)
}
