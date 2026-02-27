// Firestore appointments — created from chatbot booking flow
// Firebase Admin must be initialized before any call to this module
import '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppointmentProspect {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  /** Résumé du projet/besoin collecté pendant la conversation */
  comment?: string | null;
}

export interface AppointmentSlot {
  date?: string | null;     // YYYY-MM-DD — optionnel (à planifier par l'équipe)
  time?: string | null;     // HH:MM (24h)  — optionnel
  duration: number;         // minutes
  subject: string;
  notes?: string | null;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  prospect: AppointmentProspect;
  slot: AppointmentSlot;
  source: 'chatbot';
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

// ─── DB helper ────────────────────────────────────────────────────────────────

function db() {
  return getFirestore();
}

// ─── Write ────────────────────────────────────────────────────────────────────

export async function createAppointment(
  data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Appointment> {
  const now = new Date().toISOString();
  const docRef = db().collection('appointments').doc();
  const appointment: Appointment = {
    ...data,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };
  await docRef.set(appointment);
  return appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  await db().collection('appointments').doc(id).update({
    status,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteAppointment(id: string): Promise<void> {
  await db().collection('appointments').doc(id).delete();
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    const snap = await db()
      .collection('appointments')
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d) => d.data() as Appointment);
  } catch {
    return [];
  }
}
