import type { SocialPost, PlatformResult } from '@/lib/firestore-social';

export interface SocialTokens {
  facebookPageId: string;
  facebookPageAccessToken: string;
  instagramBusinessAccountId: string;
  linkedinAccessToken: string;
  linkedinOrganizationId: string;
}

export interface PublishResults {
  facebook?: PlatformResult;
  instagram?: PlatformResult;
  linkedin?: PlatformResult;
  status: 'published' | 'partial' | 'failed';
}

// ── Facebook ──────────────────────────────────────────────────────────────

async function publishToFacebook(
  post: SocialPost,
  tokens: SocialTokens
): Promise<PlatformResult> {
  const { facebookPageId, facebookPageAccessToken } = tokens;

  if (!facebookPageId || !facebookPageAccessToken) {
    return { success: false, error: 'Tokens Facebook manquants dans les paramètres' };
  }

  try {
    let url: string;
    let body: Record<string, string>;

    if (post.mediaUrl && post.mediaType === 'image') {
      // Photo post
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
      const imageUrl = post.mediaUrl.startsWith('http')
        ? post.mediaUrl
        : `${siteUrl}${post.mediaUrl}`;

      url = `https://graph.facebook.com/v19.0/${facebookPageId}/photos`;
      body = {
        url: imageUrl,
        message: post.content,
        access_token: facebookPageAccessToken,
      };
    } else if (post.mediaUrl && post.mediaType === 'video') {
      // Video post
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
      const videoUrl = post.mediaUrl.startsWith('http')
        ? post.mediaUrl
        : `${siteUrl}${post.mediaUrl}`;

      url = `https://graph.facebook.com/v19.0/${facebookPageId}/videos`;
      body = {
        file_url: videoUrl,
        description: post.content,
        access_token: facebookPageAccessToken,
      };
    } else {
      // Text post
      url = `https://graph.facebook.com/v19.0/${facebookPageId}/feed`;
      body = {
        message: post.content,
        access_token: facebookPageAccessToken,
      };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        error: data.error?.message ?? `Erreur HTTP ${res.status}`,
      };
    }

    return { success: true, postId: data.id ?? data.post_id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur inconnue Facebook',
    };
  }
}

// ── Instagram ─────────────────────────────────────────────────────────────

async function publishToInstagram(
  post: SocialPost,
  tokens: SocialTokens
): Promise<PlatformResult> {
  const { instagramBusinessAccountId, facebookPageAccessToken } = tokens;

  if (!instagramBusinessAccountId || !facebookPageAccessToken) {
    return { success: false, error: 'Tokens Instagram manquants dans les paramètres' };
  }

  if (!post.mediaUrl || post.mediaType !== 'image') {
    return {
      success: false,
      error: 'Instagram requiert une image. Les posts texte seul ne sont pas supportés.',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const imageUrl = post.mediaUrl.startsWith('http')
    ? post.mediaUrl
    : `${siteUrl}${post.mediaUrl}`;

  try {
    // Étape 1 : Créer le media container
    const createRes = await fetch(
      `https://graph.facebook.com/v19.0/${instagramBusinessAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: post.content,
          access_token: facebookPageAccessToken,
        }),
      }
    );

    const createData = await createRes.json();

    if (!createRes.ok || createData.error) {
      return {
        success: false,
        error: createData.error?.message ?? `Erreur création media Instagram (${createRes.status})`,
      };
    }

    const creationId = createData.id;

    // Étape 2 : Publier le container
    const publishRes = await fetch(
      `https://graph.facebook.com/v19.0/${instagramBusinessAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: facebookPageAccessToken,
        }),
      }
    );

    const publishData = await publishRes.json();

    if (!publishRes.ok || publishData.error) {
      return {
        success: false,
        error: publishData.error?.message ?? `Erreur publication Instagram (${publishRes.status})`,
      };
    }

    return { success: true, postId: publishData.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur inconnue Instagram',
    };
  }
}

// ── LinkedIn ──────────────────────────────────────────────────────────────

async function publishToLinkedIn(
  post: SocialPost,
  tokens: SocialTokens
): Promise<PlatformResult> {
  const { linkedinAccessToken, linkedinOrganizationId } = tokens;

  if (!linkedinAccessToken || !linkedinOrganizationId) {
    return { success: false, error: 'Tokens LinkedIn manquants dans les paramètres' };
  }

  const authorUrn = `urn:li:organization:${linkedinOrganizationId}`;
  const headers = {
    Authorization: `Bearer ${linkedinAccessToken}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  };

  try {
    let mediaCategory = 'NONE';
    let mediaArray: unknown[] = [];

    if (post.mediaUrl && post.mediaType === 'image') {
      // Étape 1 : Enregistrer l'upload
      const registerRes = await fetch(
        'https://api.linkedin.com/v2/assets?action=registerUpload',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            registerUploadRequest: {
              recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
              owner: authorUrn,
              serviceRelationships: [
                {
                  relationshipType: 'OWNER',
                  identifier: 'urn:li:userGeneratedContent',
                },
              ],
            },
          }),
        }
      );

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        return {
          success: false,
          error: `Erreur enregistrement image LinkedIn (${registerRes.status})`,
        };
      }

      const uploadUrl =
        registerData.value?.uploadMechanism?.[
          'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
        ]?.uploadUrl;
      const assetUrn = registerData.value?.asset;

      if (!uploadUrl || !assetUrn) {
        return { success: false, error: 'URL upload LinkedIn non trouvée' };
      }

      // Étape 2 : Upload de l'image
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
      const imageUrl = post.mediaUrl.startsWith('http')
        ? post.mediaUrl
        : `${siteUrl}${post.mediaUrl}`;

      const imageRes = await fetch(imageUrl);
      const imageBuffer = await imageRes.arrayBuffer();

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${linkedinAccessToken}` },
        body: imageBuffer,
      });

      if (!uploadRes.ok) {
        return { success: false, error: `Erreur upload image LinkedIn (${uploadRes.status})` };
      }

      mediaCategory = 'IMAGE';
      mediaArray = [
        {
          status: 'READY',
          description: { text: post.content.slice(0, 200) },
          media: assetUrn,
          title: { text: 'Image' },
        },
      ];
    }

    // Étape finale : Créer le post
    const postBody = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: post.content },
          shareMediaCategory: mediaCategory,
          ...(mediaArray.length > 0 ? { media: mediaArray } : {}),
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const postRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers,
      body: JSON.stringify(postBody),
    });

    const postData = await postRes.json();

    if (!postRes.ok) {
      return {
        success: false,
        error: postData.message ?? `Erreur publication LinkedIn (${postRes.status})`,
      };
    }

    return { success: true, postId: postData.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur inconnue LinkedIn',
    };
  }
}

// ── Orchestrator ──────────────────────────────────────────────────────────

export async function publishPost(
  post: SocialPost,
  tokens: SocialTokens
): Promise<PublishResults> {
  const tasks: Promise<[string, PlatformResult]>[] = [];

  if (post.platforms.includes('facebook')) {
    tasks.push(
      publishToFacebook(post, tokens).then((r) => ['facebook', r] as [string, PlatformResult])
    );
  }
  if (post.platforms.includes('instagram')) {
    tasks.push(
      publishToInstagram(post, tokens).then((r) => ['instagram', r] as [string, PlatformResult])
    );
  }
  if (post.platforms.includes('linkedin')) {
    tasks.push(
      publishToLinkedIn(post, tokens).then((r) => ['linkedin', r] as [string, PlatformResult])
    );
  }

  const settled = await Promise.allSettled(tasks);

  let facebook: PlatformResult | undefined;
  let instagram: PlatformResult | undefined;
  let linkedin: PlatformResult | undefined;

  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') {
      const [platform, result] = outcome.value;
      if (platform === 'facebook') facebook = result;
      else if (platform === 'instagram') instagram = result;
      else if (platform === 'linkedin') linkedin = result;
    }
  }

  const values = [facebook, instagram, linkedin].filter(
    (v): v is PlatformResult => v !== undefined
  );

  const allSuccess = values.length > 0 && values.every((v) => v.success);
  const allFailed = values.length > 0 && values.every((v) => !v.success);
  const status = allSuccess ? 'published' : allFailed ? 'failed' : 'partial';

  return { facebook, instagram, linkedin, status } as PublishResults;
}
