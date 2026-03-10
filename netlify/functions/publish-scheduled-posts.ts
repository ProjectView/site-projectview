// Netlify Scheduled Function — publish-scheduled-posts
// Runs every 15 minutes, publishes due scheduled social posts.
// Schedule is set in netlify.toml under [functions."publish-scheduled-posts"]

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { SocialPost } from '../../lib/firestore-social';
import { publishPost } from '../../lib/social-publisher';

// Lazy Firebase Admin init (same pattern as lib/firebase-admin.ts)
function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

async function getSiteTokens() {
  // Read tokens from Firestore or env — for simplicity read from env variables
  // (same values as data/site-settings.json but available in serverless context)
  return {
    facebookPageId: process.env.FACEBOOK_PAGE_ID ?? '',
    facebookPageAccessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN ?? '',
    instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ?? '',
    linkedinAccessToken: process.env.LINKEDIN_ACCESS_TOKEN ?? '',
    linkedinOrganizationId: process.env.LINKEDIN_ORGANIZATION_ID ?? '',
  };
}

export default async function handler() {
  console.log('[publish-scheduled-posts] Starting scheduled run...');

  try {
    const db = getDb();
    const now = new Date().toISOString();

    // Query posts due for publishing
    const snap = await db
      .collection('social-posts')
      .where('status', '==', 'scheduled')
      .where('scheduledAt', '<=', now)
      .get();

    if (snap.empty) {
      console.log('[publish-scheduled-posts] No due posts found.');
      return new Response('No due posts', { status: 200 });
    }

    const posts = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SocialPost));
    console.log(`[publish-scheduled-posts] Found ${posts.length} due post(s).`);

    const tokens = await getSiteTokens();

    for (const post of posts) {
      try {
        console.log(`[publish-scheduled-posts] Publishing post ${post.id}...`);
        const results = await publishPost(post, tokens);

        await db.collection('social-posts').doc(post.id).set(
          {
            status: results.status,
            publishedAt: results.status !== 'failed' ? new Date().toISOString() : null,
            platformResults: {
              ...(results.facebook ? { facebook: results.facebook } : {}),
              ...(results.instagram ? { instagram: results.instagram } : {}),
              ...(results.linkedin ? { linkedin: results.linkedin } : {}),
            },
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );

        console.log(`[publish-scheduled-posts] Post ${post.id} → ${results.status}`);
      } catch (err) {
        console.error(`[publish-scheduled-posts] Error publishing post ${post.id}:`, err);
        await db.collection('social-posts').doc(post.id).set(
          { status: 'failed', updatedAt: new Date().toISOString() },
          { merge: true }
        );
      }
    }

    return new Response(`Published ${posts.length} post(s)`, { status: 200 });
  } catch (err) {
    console.error('[publish-scheduled-posts] Fatal error:', err);
    return new Response('Internal error', { status: 500 });
  }
}

// Schedule is declared in netlify.toml:
// [functions."publish-scheduled-posts"]
// schedule = "*/15 * * * *"
export const config = {
  schedule: '*/15 * * * *',
};
