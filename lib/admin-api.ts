// ==========================================
// Admin API — GitHub-based article management
// Reads/writes articles to lib/fallback-data.ts via GitHub API
// Same pattern as the n8n blog publisher workflow
// ==========================================

import { Article } from '@/lib/fallback-data';

const GITHUB_API = 'https://api.github.com';

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !username || !repo) {
    throw new Error('GitHub configuration manquante. Vérifiez GITHUB_TOKEN, GITHUB_USERNAME et GITHUB_REPO dans .env.local');
  }

  return { token, username, repo, branch };
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

// ==========================================
// Fetch file from GitHub
// ==========================================

interface GitHubFileResponse {
  content: string;
  sha: string;
  encoding: string;
}

export async function fetchFileFromGitHub(filePath: string): Promise<{ content: string; sha: string }> {
  const { token, username, repo, branch } = getGitHubConfig();

  const url = `${GITHUB_API}/repos/${username}/${repo}/contents/${filePath}?ref=${branch}`;
  const response = await fetch(url, { headers: githubHeaders(token), cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Erreur GitHub GET ${filePath}: ${response.status} ${response.statusText}`);
  }

  const data: GitHubFileResponse = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content, sha: data.sha };
}

// ==========================================
// Commit file to GitHub
// ==========================================

export async function commitFileToGitHub(
  filePath: string,
  content: string,
  message: string,
  sha: string
): Promise<void> {
  const { token, username, repo, branch } = getGitHubConfig();

  const url = `${GITHUB_API}/repos/${username}/${repo}/contents/${filePath}`;
  const body = {
    message,
    content: Buffer.from(content).toString('base64'),
    sha,
    branch,
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: githubHeaders(token),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Erreur GitHub PUT ${filePath}: ${response.status} — ${errorData}`);
  }
}

// ==========================================
// Trigger Netlify deploy
// ==========================================

export async function triggerNetlifyDeploy(): Promise<boolean> {
  const hookUrl = process.env.NETLIFY_BUILD_HOOK;
  if (!hookUrl) return false;

  try {
    const response = await fetch(hookUrl, { method: 'POST' });
    return response.ok;
  } catch {
    return false;
  }
}

// ==========================================
// Parse articles from fallback-data.ts
// ==========================================

const FALLBACK_DATA_PATH = 'lib/fallback-data.ts';

export async function getArticlesFromGitHub(): Promise<{ articles: Article[]; sha: string; rawContent: string }> {
  const { content, sha } = await fetchFileFromGitHub(FALLBACK_DATA_PATH);

  // Extract the articles array from the TypeScript source
  const articlesMatch = content.match(/export\s+const\s+articles:\s*Article\[\]\s*=\s*\[([\s\S]*?)\n\];/);
  if (!articlesMatch) {
    throw new Error('Impossible de parser le tableau articles dans fallback-data.ts');
  }

  // Parse individual article objects
  const articlesBlock = articlesMatch[1];
  const articles: Article[] = [];
  const articleRegex = /\{[\s\S]*?title:\s*['"`]([\s\S]*?)['"`][\s\S]*?slug:\s*['"`]([\s\S]*?)['"`][\s\S]*?excerpt:\s*['"`]([\s\S]*?)['"`][\s\S]*?content:\s*['"`]([\s\S]*?)['"`][\s\S]*?category:\s*['"`]([\s\S]*?)['"`][\s\S]*?categorySlug:\s*['"`]([\s\S]*?)['"`][\s\S]*?date:\s*['"`]([\s\S]*?)['"`][\s\S]*?author:\s*['"`]([\s\S]*?)['"`][\s\S]*?authorBio:\s*['"`]([\s\S]*?)['"`][\s\S]*?readTime:\s*['"`]([\s\S]*?)['"`][\s\S]*?\}/g;

  let match;
  while ((match = articleRegex.exec(articlesBlock)) !== null) {
    articles.push({
      title: unescapeQuotes(match[1]),
      slug: match[2],
      excerpt: unescapeQuotes(match[3]),
      content: unescapeQuotes(match[4]),
      category: unescapeQuotes(match[5]),
      categorySlug: match[6],
      date: match[7],
      author: unescapeQuotes(match[8]),
      authorBio: unescapeQuotes(match[9]),
      readTime: match[10],
    });
  }

  return { articles, sha, rawContent: content };
}

function unescapeQuotes(str: string): string {
  return str.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
}

function escapeForTS(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

// ==========================================
// Serialize an article to TypeScript source
// ==========================================

function articleToTS(article: Article): string {
  const coverLine = article.coverImage
    ? `\n    coverImage: '${escapeForTS(article.coverImage)}',`
    : '';
  return `  {
    title: '${escapeForTS(article.title)}',
    slug: '${article.slug}',
    excerpt: '${escapeForTS(article.excerpt)}',
    content: '${escapeForTS(article.content)}',
    category: '${escapeForTS(article.category)}',
    categorySlug: '${article.categorySlug}',
    date: '${article.date}',
    author: '${escapeForTS(article.author)}',
    authorBio: '${escapeForTS(article.authorBio)}',
    readTime: '${article.readTime}',${coverLine}
  }`;
}

// ==========================================
// Generate slug from title
// ==========================================

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')    // remove special chars
    .replace(/\s+/g, '-')            // spaces to hyphens
    .replace(/-+/g, '-')             // collapse hyphens
    .replace(/^-|-$/g, '')           // trim hyphens
    .slice(0, 80);                   // limit length
}

// ==========================================
// Format current date in French
// ==========================================

export function formatDateFR(): string {
  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc',
  ];
  const now = new Date();
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

// ==========================================
// Inject article into fallback-data.ts
// ==========================================

export async function injectArticle(article: Article): Promise<void> {
  const { sha, rawContent } = await getArticlesFromGitHub();

  const articleTS = articleToTS(article);

  // Insert at the beginning of the articles array
  const newContent = rawContent.replace(
    /export\s+const\s+articles:\s*Article\[\]\s*=\s*\[/,
    `export const articles: Article[] = [\n${articleTS},`
  );

  await commitFileToGitHub(
    FALLBACK_DATA_PATH,
    newContent,
    `blog: add "${article.title}" [admin back-office]`,
    sha
  );

  await triggerNetlifyDeploy();
}

// ==========================================
// Update an existing article
// ==========================================

export async function updateArticle(slug: string, updatedArticle: Article): Promise<void> {
  const { articles, sha, rawContent } = await getArticlesFromGitHub();

  const existingIndex = articles.findIndex((a) => a.slug === slug);
  if (existingIndex === -1) {
    throw new Error(`Article avec le slug "${slug}" introuvable.`);
  }

  // Build the old article TS to find and replace
  const oldArticleTS = articleToTS(articles[existingIndex]);
  const newArticleTS = articleToTS(updatedArticle);

  // Replace in the raw content
  let newContent = rawContent;

  // Find the old article block and replace it
  const oldArticlePattern = oldArticleTS.trim();
  if (newContent.includes(oldArticlePattern)) {
    newContent = newContent.replace(oldArticlePattern, newArticleTS.trim());
  } else {
    // Fallback: rebuild the entire articles array
    const updatedArticles = [...articles];
    updatedArticles[existingIndex] = updatedArticle;
    const allArticlesTS = updatedArticles.map(articleToTS).join(',\n');
    newContent = rawContent.replace(
      /export\s+const\s+articles:\s*Article\[\]\s*=\s*\[[\s\S]*?\n\];/,
      `export const articles: Article[] = [\n${allArticlesTS},\n];`
    );
  }

  await commitFileToGitHub(
    FALLBACK_DATA_PATH,
    newContent,
    `blog: update "${updatedArticle.title}" [admin back-office]`,
    sha
  );

  await triggerNetlifyDeploy();
}

// ==========================================
// Remove an article
// ==========================================

export async function removeArticle(slug: string): Promise<void> {
  const { articles, sha, rawContent } = await getArticlesFromGitHub();

  const existingIndex = articles.findIndex((a) => a.slug === slug);
  if (existingIndex === -1) {
    throw new Error(`Article avec le slug "${slug}" introuvable.`);
  }

  const removedTitle = articles[existingIndex].title;

  // Rebuild the articles array without the deleted one
  const updatedArticles = articles.filter((a) => a.slug !== slug);
  const allArticlesTS = updatedArticles.map(articleToTS).join(',\n');

  const newContent = rawContent.replace(
    /export\s+const\s+articles:\s*Article\[\]\s*=\s*\[[\s\S]*?\n\];/,
    `export const articles: Article[] = [\n${allArticlesTS},\n];`
  );

  await commitFileToGitHub(
    FALLBACK_DATA_PATH,
    newContent,
    `blog: remove "${removedTitle}" [admin back-office]`,
    sha
  );

  await triggerNetlifyDeploy();
}

// ==========================================
// Estimate read time
// ==========================================

export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}
