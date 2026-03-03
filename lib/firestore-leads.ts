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
  // CRM
  status: LeadStatus;
  source?: LeadSource;
  priority?: LeadPriority;
  comment?: string;
  nextAction?: string;      // Description de la prochaine action
  nextActionDate?: string;  // YYYY-MM-DD
  // Meta
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = 'leads';

function db() {
  return getAdminFirestore().collection(COLLECTION);
}

export async function getAllLeads(): Promise<Lead[]> {
  const snap = await db().orderBy('createdAt', 'desc').get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lead));
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
  await db().doc(id).delete();
}
