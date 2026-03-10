import { getAdminFirestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'conversations';

function db() {
  return getAdminFirestore().collection(COLLECTION);
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  messages: ConversationMessage[];
  visitorName?: string;
  visitorEmail?: string;
  appointmentId?: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
}

export async function getAllConversations(): Promise<Conversation[]> {
  const snap = await db().orderBy('lastMessageAt', 'desc').get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Conversation));
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const doc = await db().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Conversation;
}

export async function appendMessages(
  sessionId: string,
  msgs: ConversationMessage[],
  updates?: { visitorName?: string; visitorEmail?: string; appointmentId?: string },
): Promise<void> {
  const ref = db().doc(sessionId);
  const doc = await ref.get();
  const now = new Date().toISOString();

  if (!doc.exists) {
    await ref.set({
      id: sessionId,
      messages: msgs,
      startedAt: now,
      lastMessageAt: now,
      messageCount: msgs.length,
      ...(updates ?? {}),
    });
  } else if (msgs.length > 0) {
    await ref.update({
      messages: FieldValue.arrayUnion(...msgs),
      lastMessageAt: now,
      messageCount: FieldValue.increment(msgs.length),
      ...(updates ?? {}),
    });
  } else if (updates) {
    await ref.update({ ...updates });
  }
}

export async function deleteConversation(id: string): Promise<boolean> {
  const doc = await db().doc(id).get();
  if (!doc.exists) return false;
  await db().doc(id).delete();
  return true;
}
