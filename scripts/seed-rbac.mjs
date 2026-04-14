#!/usr/bin/env node
/**
 * Seed RBAC — ProjectView Pulse
 *
 * Idempotent : peut être relancé sans casser quoi que ce soit.
 * Crée :
 *   - L'organisation ProjectView (type=projectview, parentOrgId=null)
 *   - Le user superadmin Bernard (lookup par email dans Firebase Auth)
 *   - L'app Lucy dans le registre apps/
 *
 * Usage :
 *   node scripts/seed-rbac.mjs
 *
 * Requiert dans .env.local :
 *   FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

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
} catch (e) {
  console.warn('⚠️  .env.local non trouvé — on suppose que les vars sont déjà exportées.')
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
const auth = getAuth()

// --- Config seed ---
const SUPERADMIN_EMAIL = 'bernard@projectview.fr'
const SUPERADMIN_NAME = 'Bernard'
const ORG_NAME = 'ProjectView'

// --- Helpers ---
async function findOrCreateOrg() {
  const snap = await db
    .collection('organizations')
    .where('type', '==', 'projectview')
    .limit(1)
    .get()
  if (!snap.empty) {
    console.log(`✓ Org ProjectView existe déjà (id=${snap.docs[0].id})`)
    return snap.docs[0].id
  }
  const ref = db.collection('organizations').doc()
  const now = FieldValue.serverTimestamp()
  await ref.set({
    name: ORG_NAME,
    type: 'projectview',
    parentOrgId: null,
    axonautId: null,
    plan: null,
    createdAt: now,
    updatedAt: now,
  })
  console.log(`✓ Org ProjectView créée (id=${ref.id})`)
  return ref.id
}

async function findOrCreateSuperadmin(orgId) {
  let userRecord
  try {
    userRecord = await auth.getUserByEmail(SUPERADMIN_EMAIL)
  } catch (e) {
    console.error(`❌ Aucun compte Firebase Auth pour ${SUPERADMIN_EMAIL}`)
    console.error('   Crée d\'abord le compte dans Firebase Console > Authentication.')
    process.exit(1)
  }

  const uid = userRecord.uid
  const docRef = db.collection('users').doc(uid)
  const docSnap = await docRef.get()

  if (docSnap.exists) {
    // Mise à jour défensive : force globalRole=superadmin et orgId courant
    await docRef.update({
      globalRole: 'superadmin',
      orgId,
      disabled: false,
    })
    console.log(`✓ User superadmin existe (uid=${uid}) — globalRole/orgId resynchronisés`)
    return uid
  }

  await docRef.set({
    email: SUPERADMIN_EMAIL.toLowerCase(),
    displayName: SUPERADMIN_NAME,
    orgId,
    globalRole: 'superadmin',
    enabledApps: { lucy: true },
    appRoles: { lucy: 'admin' },
    createdAt: FieldValue.serverTimestamp(),
    lastLoginAt: null,
    disabled: false,
  })
  console.log(`✓ User superadmin créé (uid=${uid})`)
  return uid
}

async function upsertLucyApp() {
  const slug = 'lucy'
  const snap = await db.collection('apps').where('slug', '==', slug).limit(1).get()
  const payload = {
    slug,
    name: 'Lucy',
    icon: 'mic',
    route: '/admin/lucy',
    landingPage: 'https://projectview.fr/lucy',
    availableRoles: ['admin', 'user'],
    requiresLicense: true,
    enabledByDefault: {
      superadmin: true,
      admin_client: true,
      user_client: true,
    },
    order: 10,
    active: true,
  }
  if (!snap.empty) {
    await db.collection('apps').doc(snap.docs[0].id).update(payload)
    console.log(`✓ App Lucy existe — payload resynchronisé (id=${snap.docs[0].id})`)
    return
  }
  const ref = db.collection('apps').doc()
  await ref.set({ ...payload, createdAt: FieldValue.serverTimestamp() })
  console.log(`✓ App Lucy créée (id=${ref.id})`)
}

// --- Run ---
;(async () => {
  console.log('🌱 Seed RBAC ProjectView Pulse — démarrage…\n')
  const orgId = await findOrCreateOrg()
  const uid = await findOrCreateSuperadmin(orgId)
  await upsertLucyApp()
  console.log(`\n✅ Seed terminé.`)
  console.log(`   Org ProjectView  : ${orgId}`)
  console.log(`   Superadmin UID    : ${uid}`)
  console.log(`   Email             : ${SUPERADMIN_EMAIL}`)
  process.exit(0)
})().catch((err) => {
  console.error('❌ Erreur seed :', err)
  process.exit(1)
})
