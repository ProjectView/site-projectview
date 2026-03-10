import { getAdminFirestore } from '@/lib/firebase-admin';

// ── Types ──────────────────────────────────────────────────────────────────

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin';

export type SocialPostStatus =
  | 'draft'
  | 'scheduled'
  | 'published'
  | 'failed'
  | 'partial';

export interface PlatformResult {
  success: boolean;
  postId?: string;
  error?: string;
}

export interface SocialPost {
  id: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  platforms: SocialPlatform[];
  status: SocialPostStatus;
  scheduledAt?: string;   // ISO — absent = publier maintenant
  publishedAt?: string;   // ISO — rempli après publication
  platformResults?: {
    facebook?: PlatformResult;
    instagram?: PlatformResult;
    linkedin?: PlatformResult;
  };
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = 'social-posts';

function db() {
  return getAdminFirestore().collection(COLLECTION);
}

// ── CRUD ──────────────────────────────────────────────────────────────────

export async function getAllSocialPosts(): Promise<SocialPost[]> {
  const snap = await db().orderBy('createdAt', 'desc').get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SocialPost));
}

export async function getDueSocialPosts(): Promise<SocialPost[]> {
  const now = new Date().toISOString();
  const snap = await db()
    .where('status', '==', 'scheduled')
    .where('scheduledAt', '<=', now)
    .get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SocialPost));
}

export async function getSocialPostById(id: string): Promise<SocialPost | null> {
  const doc = await db().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as SocialPost;
}

export async function createSocialPost(
  data: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SocialPost> {
  const now = new Date().toISOString();
  const ref = db().doc();
  const post: SocialPost = {
    ...data,
    id: ref.id,
    status: data.status ?? 'draft',
    createdAt: now,
    updatedAt: now,
  };
  await ref.set(post);
  return post;
}

export async function updateSocialPost(
  id: string,
  data: Partial<Omit<SocialPost, 'id' | 'createdAt'>>
): Promise<SocialPost> {
  const now = new Date().toISOString();
  const update = { ...data, updatedAt: now };
  await db().doc(id).set(update, { merge: true });
  const doc = await db().doc(id).get();
  return { id, ...doc.data() } as SocialPost;
}

export async function deleteSocialPost(id: string): Promise<void> {
  await db().doc(id).delete();
}
