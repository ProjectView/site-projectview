/**
 * Vercel Function: N8N Webhook Handler
 *
 * Receives article data from N8N ProjectBot and:
 * 1. Saves article markdown to /src/content/articles/{slug}.md
 * 2. Generates React wrapper component
 * 3. Updates main.jsx with new route
 * 4. Commits changes to GitHub
 * 5. Updates Google Sheet article registry
 *
 * Expected POST body:
 * {
 *   "articleMarkdown": "---\nid: ...\n---\n...",
 *   "frontmatter": { id, title, category, date, tags, ... },
 *   "nanobananaPrompts": [ { name, prompt, ... }, ... ],
 *   "approved": true/false
 * }
 *
 * Environment variables required:
 * - GITHUB_TOKEN: GitHub API token for commits
 * - GOOGLE_SHEETS_API_KEY: Google Sheets API key
 * - GOOGLE_SHEETS_SPREADSHEET_ID: Google Sheet ID for article registry
 * - GITHUB_REPO_OWNER: GitHub repository owner
 * - GITHUB_REPO_NAME: GitHub repository name
 */

import { writeFileSync, readFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

/**
 * Generate React wrapper component for article
 */
function generateArticleComponent(frontmatter) {
  const slug = frontmatter.id.replace(/-/g, '');
  const componentName = frontmatter.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return `import React from 'react';
import ArticleRenderer from './ArticleRenderer';
import articleContent from '@/content/articles/${frontmatter.id}.md?raw';

const ${componentName} = () => {
  return <ArticleRenderer markdownContent={articleContent} />;
};

export default ${componentName};
`;
}

/**
 * Save article markdown file
 */
function saveArticle(articleMarkdown, frontmatter) {
  const articlePath = join(process.cwd(), 'src', 'content', 'articles', `${frontmatter.id}.md`);
  writeFileSync(articlePath, articleMarkdown, 'utf-8');
}

/**
 * Save article React wrapper component
 */
function saveComponent(frontmatter) {
  const componentName = frontmatter.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const componentPath = join(process.cwd(), 'src', 'components', `${componentName}.jsx`);
  const componentCode = generateArticleComponent(frontmatter);
  writeFileSync(componentPath, componentCode, 'utf-8');
}

/**
 * Update main.jsx with new route
 */
function updateMainJsx(frontmatter) {
  const componentName = frontmatter.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const mainPath = join(process.cwd(), 'src', 'main.jsx');
  let mainContent = readFileSync(mainPath, 'utf-8');

  // Add import if not present
  if (!mainContent.includes(`import ${componentName}`)) {
    const importLine = `import ${componentName} from './components/${componentName}'`;
    const lastImportMatch = mainContent.match(/import .* from '\.\/components\/\w+'\n/g);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      mainContent = mainContent.replace(lastImport, lastImport + importLine + '\n');
    }
  }

  // Add route if not present
  const routePath = `/article/${frontmatter.id}`;
  const routeLine = `        <Route path="${routePath}" element={<${componentName} />} />`;
  if (!mainContent.includes(`path="${routePath}"`)) {
    const lastArticleRoute = mainContent.match(/        <Route path="\/article\/[\w-]+" element={<\w+ \/\>} \/>\n/g);
    if (lastArticleRoute) {
      const route = lastArticleRoute[lastArticleRoute.length - 1];
      mainContent = mainContent.replace(route, route + routeLine + '\n');
    }
  }

  writeFileSync(mainPath, mainContent, 'utf-8');
}

/**
 * Commit changes to GitHub
 */
function commitToGitHub(frontmatter) {
  try {
    const articlePath = `src/content/articles/${frontmatter.id}.md`;
    const componentName = frontmatter.id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    const componentPath = `src/components/${componentName}.jsx`;

    // Stage files
    execSync(`git add "${articlePath}" "${componentPath}" src/main.jsx`, {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    // Create commit
    const commitMessage = `📝 Add article: ${frontmatter.title}`;
    execSync(`git commit -m "${commitMessage}"`, {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    // Push to GitHub
    execSync('git push origin main', {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    return true;
  } catch (error) {
    console.error('Git commit failed:', error.message);
    return false;
  }
}

/**
 * Update Google Sheet article registry
 */
async function updateGoogleSheet(frontmatter) {
  if (!process.env.GOOGLE_SHEETS_API_KEY || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    console.warn('⚠️ Google Sheets not configured, skipping registry update');
    return false;
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Format: [ID, Title, Date, Category, Tags, Topics, Keywords, Status, URL, Notes]
    const row = [
      frontmatter.id,
      frontmatter.title,
      frontmatter.date,
      frontmatter.category,
      (frontmatter.tags || []).join('|'),
      frontmatter.category,
      (frontmatter.seoKeywords || []).join('|'),
      'published',
      `https://projectview-site.vercel.app/article/${frontmatter.id}`,
      `Generated by ProjectBot on ${new Date().toISOString()}`
    ];

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Articles!A:J:append`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GOOGLE_SHEETS_API_KEY}`
        },
        body: JSON.stringify({
          values: [row],
          valueInputOption: 'USER_ENTERED'
        })
      }
    );

    if (!response.ok) {
      console.error('Google Sheets API error:', response.statusText);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Updated Google Sheet (${result.updates?.updatedCells} cells)`);
    return true;
  } catch (error) {
    console.error('Google Sheets error:', error.message);
    return false;
  }
}

/**
 * Send Telegram notification
 */
async function sendTelegramNotification(frontmatter) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return false;
  }

  try {
    const message = `
✅ **Article Published!**

📝 **${frontmatter.title}**
📂 Category: ${frontmatter.category}
🔗 URL: https://projectview-site.vercel.app/article/${frontmatter.id}
📅 Date: ${frontmatter.date}

Tags: ${(frontmatter.tags || []).join(', ')}
`;

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Telegram notification error:', error.message);
    return false;
  }
}

/**
 * Main handler
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { articleMarkdown, frontmatter, nanobananaPrompts, approved } = req.body;

    // Validate required fields
    if (!articleMarkdown || !frontmatter || !frontmatter.id || !frontmatter.title) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: articleMarkdown, frontmatter (with id and title)'
      });
    }

    // Validate article ID format (kebab-case)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid article ID. Use kebab-case only (e.g., "article-slug")'
      });
    }

    // Check if article is approved
    if (!approved) {
      console.log(`📋 Article draft saved: ${frontmatter.title}`);
      return res.status(200).json({
        status: 'pending_approval',
        message: 'Article saved as draft. Awaiting approval from Adelin before publication.',
        article: {
          id: frontmatter.id,
          title: frontmatter.title
        }
      });
    }

    // Save article markdown
    try {
      saveArticle(articleMarkdown, frontmatter);
      console.log(`✅ Saved article: ${frontmatter.id}.md`);
    } catch (error) {
      console.error('Error saving article:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to save article markdown',
        details: error.message
      });
    }

    // Generate and save React wrapper component
    try {
      saveComponent(frontmatter);
      console.log(`✅ Created component: ${frontmatter.id}.jsx`);
    } catch (error) {
      console.error('Error creating component:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create React component',
        details: error.message
      });
    }

    // Update main.jsx with new route
    try {
      updateMainJsx(frontmatter);
      console.log(`✅ Added route to main.jsx`);
    } catch (error) {
      console.error('Error updating main.jsx:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update main.jsx route',
        details: error.message
      });
    }

    // Commit to GitHub (if configured)
    let gitCommitted = false;
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO_OWNER && process.env.GITHUB_REPO_NAME) {
      gitCommitted = commitToGitHub(frontmatter);
      if (gitCommitted) {
        console.log(`✅ Committed to GitHub`);
      } else {
        console.warn('⚠️ Git commit failed, but article was saved locally');
      }
    } else {
      console.warn('⚠️ GitHub not configured, skipping auto-commit');
    }

    // Update Google Sheet registry (if configured)
    const sheetUpdated = await updateGoogleSheet(frontmatter);

    // Send Telegram notification (if configured)
    const notificationSent = await sendTelegramNotification(frontmatter);

    return res.status(201).json({
      status: 'success',
      message: 'Article published successfully',
      article: {
        id: frontmatter.id,
        title: frontmatter.title,
        url: `https://projectview-site.vercel.app/article/${frontmatter.id}`
      },
      integrations: {
        github: gitCommitted ? 'success' : 'skipped',
        sheets: sheetUpdated ? 'success' : 'skipped',
        telegram: notificationSent ? 'success' : 'skipped'
      }
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      details: error.message
    });
  }
}
