import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getSocialPostById, updateSocialPost } from '@/lib/firestore-social';
import { publishPost } from '@/lib/social-publisher';
import { getSiteSettings } from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const post = await getSocialPostById(id);
    if (!post) return NextResponse.json({ error: 'Post introuvable' }, { status: 404 });

    if (post.status === 'published') {
      return NextResponse.json({ error: 'Ce post est déjà publié' }, { status: 400 });
    }

    const settings = getSiteSettings();
    const tokens = settings.socialTokens;

    const results = await publishPost(post, tokens);

    const updatedPost = await updateSocialPost(id, {
      status: results.status,
      publishedAt: results.status !== 'failed' ? new Date().toISOString() : undefined,
      platformResults: {
        ...(results.facebook ? { facebook: results.facebook } : {}),
        ...(results.instagram ? { instagram: results.instagram } : {}),
        ...(results.linkedin ? { linkedin: results.linkedin } : {}),
      },
    });

    return NextResponse.json({ post: updatedPost, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
