import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAllSocialPosts, createSocialPost } from '@/lib/firestore-social';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const posts = await getAllSocialPosts();
    return NextResponse.json(posts);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { content, platforms, mediaUrl, mediaType, status, scheduledAt } = body;

    if (!content || !platforms?.length) {
      return NextResponse.json(
        { error: 'content et platforms sont requis' },
        { status: 400 }
      );
    }

    const post = await createSocialPost({
      content,
      platforms,
      ...(mediaUrl ? { mediaUrl } : {}),
      ...(mediaType ? { mediaType } : {}),
      status: status ?? 'draft',
      ...(scheduledAt ? { scheduledAt } : {}),
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
