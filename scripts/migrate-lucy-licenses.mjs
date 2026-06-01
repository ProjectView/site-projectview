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
 *   1) Collection `licenses` : normalise `features.allowedModes`
 *        - 'offline'          → 'local'
 *        - 'online' | 'hybrid'→ 'cloud'
 *      Dédupliqué. Ne touche QUE les docs contenant des valeurs legacy
 *      (idempotent : un doc déjà en local/cloud est laissé tel quel).
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

// --- 1) Normaliser `licenses` ---
const licSnap = await db.collection('licenses').get()
console.log(`• ${licSnap.size} docs dans 'licenses'.`)
let normalized = 0
for (const doc of licSnap.docs) {
  const data = doc.data()
  const before = data.features?.allowedModes
  const after = normalizeModes(before)
  if (!after) continue
  normalized++
  report.push([
    'licenses', doc.id, data.key ?? '', data.type ?? '', data.status ?? '',
    `"${JSON.stringify(before)}"`, `"${JSON.stringify(after)}"`,
    APPLY ? 'UPDATED' : 'WOULD_UPDATE',
  ].join(','))
  console.log(`  ${APPLY ? '✏️ ' : '→ '} ${data.key ?? doc.id} : ${JSON.stringify(before)} → ${JSON.stringify(after)}`)
  if (APPLY) {
    await doc.ref.update({ 'features.allowedModes': after, updatedAt: new Date().toISOString() })
  }
}
console.log(`  ${normalized} doc(s) ${APPLY ? 'normalisé(s)' : 'à normaliser'}.\n`)

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
if (!APPLY && normalized > 0) {
  console.log(`Relance avec --apply pour normaliser les ${normalized} licence(s).`)
}
