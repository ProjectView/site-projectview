import { getAdminFirestore } from '@/lib/firebase-admin';

const COLLECTION = 'messages';

function db() {
  return getAdminFirestore().collection(COLLECTION);
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  solution: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export async function getAllMessages(): Promise<Message[]> {
  const snap = await db().orderBy('createdAt', 'desc').get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message));
}

export async function getUnreadCount(): Promise<number> {
  const snap = await db().where('read', '==', false).get();
  return snap.size;
}

export async function getMessageById(id: string): Promise<Message | null> {
  const doc = await db().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Message;
}

export async function createMessage(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  solution?: string;
  message: string;
}): Promise<Message> {
  const now = new Date().toISOString();
  const ref = db().doc();
  const msg: Message = {
    id: ref.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? '',
    company: data.company ?? '',
    solution: data.solution ?? '',
    message: data.message,
    read: false,
    createdAt: now,
  };
  await ref.set(msg);
  return msg;
}

export async function markMessageAsRead(id: string): Promise<boolean> {
  const doc = await db().doc(id).get();
  if (!doc.exists) return false;
  await db().doc(id).update({ read: true });
  return true;
}

export async function markMessageAsUnread(id: string): Promise<boolean> {
  const doc = await db().doc(id).get();
  if (!doc.exists) return false;
  await db().doc(id).update({ read: false });
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const doc = await db().doc(id).get();
  if (!doc.exists) return false;
  await db().doc(id).delete();
  return true;
}
