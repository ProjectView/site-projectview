import { getAdminFirestore } from '@/lib/firebase-admin';

// ── Types ──────────────────────────────────────────────────────────────────

export interface SequenceEmail {
  subject: string;
  body: string;       // Texte avec variables {{prenom}}, {{nom}}, {{societe}}, {{email}}, {{telephone}}
  delayDays: number;  // 0=J+0, 3=J+3, 7=J+7...
}

export interface EmailSequence {
  id: string;
  name: string;
  description?: string;
  emails: SequenceEmail[];
  createdAt: string;
  updatedAt: string;
}

export type SequenceRunStatus = 'envoyé' | 'erreur';

export interface SequenceRun {
  id: string;
  sequenceId: string;
  sequenceName: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadCompany: string;
  status: SequenceRunStatus;
  sentToN8nAt: string;
  errorMessage?: string;
  createdAt: string;
}

// ── Collections ───────────────────────────────────────────────────────────

function sequencesDb() {
  return getAdminFirestore().collection('sequences');
}

function runsDb() {
  return getAdminFirestore().collection('sequence_runs');
}

// ── Sequences CRUD ────────────────────────────────────────────────────────

export async function getAllSequences(): Promise<EmailSequence[]> {
  const snap = await sequencesDb().orderBy('createdAt', 'desc').get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as EmailSequence));
}

export async function getSequenceById(id: string): Promise<EmailSequence | null> {
  const doc = await sequencesDb().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as EmailSequence;
}

export async function createSequence(
  data: Omit<EmailSequence, 'id' | 'createdAt' | 'updatedAt'>
): Promise<EmailSequence> {
  const now = new Date().toISOString();
  const ref = sequencesDb().doc();
  const sequence: EmailSequence = { ...data, id: ref.id, createdAt: now, updatedAt: now };
  await ref.set(sequence);
  return sequence;
}

export async function updateSequence(
  id: string,
  data: Partial<Omit<EmailSequence, 'id' | 'createdAt'>>
): Promise<EmailSequence> {
  const now = new Date().toISOString();
  await sequencesDb().doc(id).set({ ...data, updatedAt: now }, { merge: true });
  const doc = await sequencesDb().doc(id).get();
  return { id, ...doc.data() } as EmailSequence;
}

export async function deleteSequence(id: string): Promise<void> {
  await sequencesDb().doc(id).delete();
}

export async function duplicateSequence(id: string): Promise<EmailSequence> {
  const original = await getSequenceById(id);
  if (!original) throw new Error('Séquence introuvable');
  return createSequence({
    name: `${original.name} (copie)`,
    description: original.description,
    emails: original.emails,
  });
}

// ── Sequence Runs CRUD ────────────────────────────────────────────────────

export async function getAllRuns(): Promise<SequenceRun[]> {
  const snap = await runsDb().orderBy('createdAt', 'desc').get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SequenceRun));
}

export async function createRun(
  data: Omit<SequenceRun, 'id' | 'createdAt'>
): Promise<SequenceRun> {
  const now = new Date().toISOString();
  const ref = runsDb().doc();
  const run: SequenceRun = { ...data, id: ref.id, createdAt: now };
  await ref.set(run);
  return run;
}

export async function updateRunStatus(
  id: string,
  status: SequenceRunStatus,
  errorMessage?: string
): Promise<void> {
  await runsDb().doc(id).set({ status, ...(errorMessage ? { errorMessage } : {}) }, { merge: true });
}
