import { getAdminFirestore } from '@/lib/firebase-admin';

// ── Types ──────────────────────────────────────────────────────────────────

export type LeadStatus =
  | 'nouveau'
  | 'contacte'
  | 'en-discussion'
  | 'proposition'
  | 'gagne'
  | 'perdu';

export type LeadSource =
  | 'site-web'
  | 'chatbot'
  | 'referral'
  | 'salon'
  | 'cold'
  | 'autre';

export type LeadPriority = 'low' | 'medium' | 'high';

export type NoteType = 'note' | 'appel' | 'email' | 'reunion' | 'relance';

export interface Lead {
  id: string;
  // Identité
  firstName: string;
  lastName: string;
  company: string;
  // Contact
  email: string;
  phone: string;
  address?: string;
  // Société
  sector?: string;
  website?: string;
  // CRM
  status: LeadStatus;
  source?: LeadSource;
  priority?: LeadPriority;
  comment?: string;
  nextAction?: string;      // Description de la prochaine action
  nextActionDate?: string;  // YYYY-MM-DD
  // Conversion
  isClient?: boolean;       // true quand converti en client
  clientSince?: string;     // ISO date de conversion
  // Commercial
  contractValue?: number;   // Valeur du contrat en €
  contractDate?: string;    // Date de signature YYYY-MM-DD
  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  type: NoteType;
  content: string;
  createdAt: string; // ISO
  author: string;
}

const COLLECTION = 'leads';

function db() {
  return getAdminFirestore().collection(COLLECTION);
}

function notesDb(leadId: string) {
  return db().doc(leadId).collection('notes');
}

// ── Lead CRUD ─────────────────────────────────────────────────────────────

export async function getAllLeads(): Promise<Lead[]> {
  const snap = await db().orderBy('createdAt', 'desc').get();
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Lead))
    .filter((l) => !l.isClient);
}

export async function getAllClients(): Promise<Lead[]> {
  const snap = await db().orderBy('createdAt', 'desc').get();
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() } as Lead))
    .filter((l) => l.isClient === true);
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const doc = await db().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Lead;
}

export async function createLead(
  data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Lead> {
  const now = new Date().toISOString();
  const ref = db().doc();
  const lead: Lead = {
    ...data,
    id: ref.id,
    status: data.status ?? 'nouveau',
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(lead);
  return lead;
}

export async function updateLead(
  id: string,
  data: Partial<Omit<Lead, 'id' | 'createdAt'>>
): Promise<Lead> {
  const now = new Date().toISOString();
  const update = { ...data, updatedAt: now };
  await db().doc(id).set(update, { merge: true });
  const doc = await db().doc(id).get();
  return { id, ...doc.data() } as Lead;
}

export async function deleteLead(id: string): Promise<void> {
  // Delete notes subcollection first
  const noteSnap = await notesDb(id).get();
  const firestore = getAdminFirestore();
  const batch = firestore.batch();
  noteSnap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  await db().doc(id).delete();
}

export async function convertToClient(id: string): Promise<Lead> {
  const now = new Date().toISOString();
  await db().doc(id).set(
    { isClient: true, clientSince: now, status: 'gagne', updatedAt: now },
    { merge: true }
  );
  const doc = await db().doc(id).get();
  return { id, ...doc.data() } as Lead;
}

// ── Notes CRUD ────────────────────────────────────────────────────────────

export async function getNotes(leadId: string): Promise<LeadNote[]> {
  const snap = await notesDb(leadId).orderBy('createdAt', 'desc').get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as LeadNote));
}

export async function addNote(
  leadId: string,
  data: Omit<LeadNote, 'id' | 'createdAt'>
): Promise<LeadNote> {
  const now = new Date().toISOString();
  const ref = notesDb(leadId).doc();
  const note: LeadNote = { ...data, id: ref.id, createdAt: now };
  await ref.set(note);
  await db().doc(leadId).set({ updatedAt: now }, { merge: true });
  return note;
}

export async function deleteNote(leadId: string, noteId: string): Promise<void> {
  await notesDb(leadId).doc(noteId).delete();
}
