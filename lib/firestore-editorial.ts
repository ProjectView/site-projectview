import { getAdminFirestore } from '@/lib/firebase-admin';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface EditorialConfig {
  // Réseaux & audience
  activePlatforms: string[];             // ['instagram', 'linkedin', 'facebook', 'tiktok']
  audience: string;                      // description persona libre
  targetSectors: string[];              // ['Retail', 'Architecture', ...]
  // Contenu
  themes: string;                        // sujets à aborder
  avoidTopics: string;                   // sujets à éviter
  tone: string;                          // 'professionnel' | 'inspirant' | etc.
  preferredFormats: string[];            // ['carousels', 'photos', 'videos', ...]
  // Fréquence
  postsPerPlatform: Record<string, number>; // { instagram: 3, linkedin: 2 }
  // Stratégie
  keyMoments: string;
  objectives: string[];                  // ['Notoriété', 'Leads', ...]
  preferredCTA: string;                  // 'visiter-site' | 'prendre-rdv' | etc.
  inspirations: string;                  // comptes références (optionnel)
  // Charte graphique
  brandColorPrimary: string;             // ex: '#3B7A8C'
  brandColorSecondary: string;           // ex: '#6B9B37'
  brandColorAccent: string;              // ex: '#D4842A'
  visualStyle: string;                   // 'minimaliste' | 'bold' | 'editorial' | 'lifestyle' | 'corporate'
  logoUrl?: string;                      // URL Firebase Storage (optionnel)
  // Méta
  createdAt?: string;
  updatedAt?: string;
}

export interface EditorialItem {
  id: string;
  date: string;                          // YYYY-MM-DD
  theme: string;
  platform: string[];                    // ['instagram', 'linkedin'] — toujours rempli
  format?: string;                       // 'carousel' | 'photo' | 'video' | 'citation' | 'story' | 'infographie'
  objective?: string;
  status: 'planifie' | 'en-cours' | 'genere';
  linkedSlug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function db() {
  return getAdminFirestore();
}

// ── Editorial Config ───────────────────────────────────────────────────────────

export async function getEditorialConfig(): Promise<EditorialConfig | null> {
  try {
    const doc = await db().collection('editorial-config').doc('main').get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return data as EditorialConfig;
  } catch {
    return null;
  }
}

export async function saveEditorialConfig(
  config: Omit<EditorialConfig, 'createdAt' | 'updatedAt'>
): Promise<void> {
  const now = new Date().toISOString();
  const existing = await db().collection('editorial-config').doc('main').get();
  await db().collection('editorial-config').doc('main').set({
    ...config,
    createdAt: existing.exists ? existing.data()!.createdAt : now,
    updatedAt: now,
  });
}

// ── Editorial Items ────────────────────────────────────────────────────────────

export async function getAllEditorialItems(): Promise<EditorialItem[]> {
  try {
    const snap = await db()
      .collection('editorial-items')
      .orderBy('date', 'asc')
      .get();
    return snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Backward compat: ensure platform is always an array
        platform: Array.isArray(data.platform) ? data.platform : [],
        status: data.status ?? 'planifie',
      } as EditorialItem;
    });
  } catch {
    return [];
  }
}

export async function createEditorialItem(
  item: Omit<EditorialItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<EditorialItem> {
  const now = new Date().toISOString();
  const ref = db().collection('editorial-items').doc();
  const newItem: EditorialItem = {
    ...item,
    id: ref.id,
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(newItem);
  return newItem;
}

export async function updateEditorialItem(
  id: string,
  updates: Partial<Omit<EditorialItem, 'id' | 'createdAt'>>
): Promise<void> {
  const now = new Date().toISOString();
  await db()
    .collection('editorial-items')
    .doc(id)
    .set({ ...updates, updatedAt: now }, { merge: true });
}

export async function deleteEditorialItem(id: string): Promise<void> {
  await db().collection('editorial-items').doc(id).delete();
}

export async function deleteAllEditorialItems(): Promise<void> {
  const snap = await db().collection('editorial-items').get();
  if (snap.empty) return;
  const batch = db().batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

// ── Chat History ───────────────────────────────────────────────────────────────

export async function getEditorialChatHistory(): Promise<ChatMessage[]> {
  try {
    const doc = await db().collection('editorial-chat').doc('main').get();
    if (!doc.exists) return [];
    return (doc.data()?.messages as ChatMessage[]) ?? [];
  } catch {
    return [];
  }
}

export async function appendEditorialChatMessages(messages: ChatMessage[]): Promise<void> {
  const now = new Date().toISOString();
  const ref = db().collection('editorial-chat').doc('main');
  const doc = await ref.get();
  const existing: ChatMessage[] = doc.exists ? (doc.data()?.messages ?? []) : [];
  const combined = [...existing, ...messages].slice(-100);
  await ref.set({ messages: combined, updatedAt: now });
}
