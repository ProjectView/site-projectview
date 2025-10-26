/**
 * Netlify Function: N8N Webhook Handler
 *
 * Reçoit les données d'articles de N8N ProjectBot et:
 * 1. Utilise l'API GitHub pour créer les fichiers
 * 2. Sauvegarde le markdown de l'article
 * 3. Génère et sauvegarde le composant React wrapper
 * 4. Met à jour main.jsx avec la nouvelle route
 * 5. Met à jour le registre Google Sheets
 *
 * Expected POST body:
 * {
 *   "articleMarkdown": "---\nid: ...\n---\n...",
 *   "frontmatter": { id, title, category, date, tags, ... },
 *   "nanobananaPrompts": [ { name, prompt, ... }, ... ],
 *   "approved": true/false
 * }
 */

/**
 * Valider que le Markdown contient du YAML valide
 */
function validateMarkdownYAML(markdown) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    throw new Error('Markdown must start with valid YAML frontmatter (---...---)');
  }

  try {
    // Essayer de parser le YAML avec un parseur simple
    const yamlContent = match[1];
    // Vérifier les erreurs communes
    if (yamlContent.includes('["') && yamlContent.includes('"],')) {
      throw new Error('Invalid YAML: JSON arrays should not have trailing commas (e.g., ["test"], should be tags: [\\n  - test\\n])');
    }
    return true;
  } catch (error) {
    throw new Error(`Invalid YAML in frontmatter: ${error.message}`);
  }
}

/**
 * Générer le composant React pour l'article
 */
function generateArticleComponent(frontmatter) {
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
 * Créer un fichier via l'API GitHub
 */
async function createFileOnGitHub(path, content, message) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!token || !owner || !repo) {
    throw new Error('GitHub configuration missing (GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME)');
  }

  try {
    // Encoder le contenu en base64
    const encodedContent = Buffer.from(content).toString('base64');

    // Récupérer le SHA du fichier s'il existe déjà
    let sha = null;
    try {
      const getResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
      }
    } catch (e) {
      // Le fichier n'existe pas encore, c'est normal pour les nouveaux fichiers
      console.log(`File ${path} doesn't exist yet, creating new file`);
    }

    // Construire le corps de la requête
    const body = {
      message: message,
      content: encodedContent,
      branch: 'main'
    };

    // Ajouter le SHA si le fichier existe
    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GitHub API error:', error);
    throw error;
  }
}

/**
 * Récupérer et mettre à jour main.jsx
 */
async function updateMainJsx(frontmatter) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  const componentName = frontmatter.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  try {
    // Récupérer main.jsx
    const getResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/src/main.jsx`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3.raw'
        }
      }
    );

    if (!getResponse.ok) {
      throw new Error('Could not fetch main.jsx');
    }

    let mainContent = await getResponse.text();

    // Ajouter l'import
    const importLine = `import ${componentName} from './components/${componentName}'`;
    if (!mainContent.includes(importLine)) {
      const lastImportMatch = mainContent.match(/import .* from '\.\/components\/\w+'\n/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        mainContent = mainContent.replace(lastImport, lastImport + importLine + '\n');
      }
    }

    // Ajouter la route
    const routePath = `/article/${frontmatter.id}`;
    const routeLine = `        <Route path="${routePath}" element={<${componentName} />} />`;
    if (!mainContent.includes(`path="${routePath}"`)) {
      const lastArticleRoute = mainContent.match(/        <Route path="\/article\/[\w-]+" element={<\w+ \/\>} \/>\n/g);
      if (lastArticleRoute) {
        const route = lastArticleRoute[lastArticleRoute.length - 1];
        mainContent = mainContent.replace(route, route + routeLine + '\n');
      }
    }

    // Pousser la mise à jour
    await createFileOnGitHub(
      'src/main.jsx',
      mainContent,
      `🔄 Update routes for article: ${frontmatter.title}`
    );

    return true;
  } catch (error) {
    console.error('Error updating main.jsx:', error);
    throw error;
  }
}

/**
 * Mettre à jour le registre Google Sheets
 */
async function updateGoogleSheet(frontmatter) {
  if (!process.env.GOOGLE_SHEETS_API_KEY || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    console.warn('⚠️ Google Sheets not configured, skipping registry update');
    return false;
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const row = [
      frontmatter.id,
      frontmatter.title,
      frontmatter.date,
      frontmatter.category,
      (frontmatter.tags || []).join('|'),
      frontmatter.category,
      (frontmatter.seoKeywords || []).join('|'),
      'published',
      `https://projectview.fr/article/${frontmatter.id}`,
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

    console.log('✅ Google Sheet updated');
    return true;
  } catch (error) {
    console.error('Google Sheets error:', error.message);
    return false;
  }
}

/**
 * Envoyer une notification Telegram
 */
async function sendTelegramNotification(frontmatter) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return false;
  }

  try {
    const message = `
✅ **Article Publié!**

📝 **${frontmatter.title}**
📂 Catégorie: ${frontmatter.category}
🔗 URL: https://projectview.fr/article/${frontmatter.id}
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
    console.error('Telegram error:', error.message);
    return false;
  }
}

/**
 * Handler principal pour Netlify Function
 */
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const { articleMarkdown, frontmatter, nanobananaPrompts, approved } = JSON.parse(event.body);

    // Validate required fields
    if (!articleMarkdown || !frontmatter || !frontmatter.id || !frontmatter.title) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Champs manquants: articleMarkdown, frontmatter (avec id et title)'
        })
      };
    }

    // Validate article ID format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.id)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'ID d\'article invalide. Utilise kebab-case uniquement (ex: "article-slug")'
        })
      };
    }

    // Validate YAML structure before processing
    try {
      validateMarkdownYAML(articleMarkdown);
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'YAML validation failed',
          details: error.message
        })
      };
    }

    // Check if approved
    if (!approved) {
      console.log(`📋 Article draft saved: ${frontmatter.title}`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'pending_approval',
          message: 'Article sauvegardé en brouillon. En attente d\'approbation d\'Adelin avant publication.',
          article: {
            id: frontmatter.id,
            title: frontmatter.title
          }
        })
      };
    }

    // Create article markdown file
    try {
      await createFileOnGitHub(
        `src/content/articles/${frontmatter.id}.md`,
        articleMarkdown,
        `📝 Add article: ${frontmatter.title}`
      );
      console.log(`✅ Article markdown created: ${frontmatter.id}.md`);
    } catch (error) {
      console.error('Error creating article:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Impossible de sauvegarder le markdown',
          details: error.message
        })
      };
    }

    // Create component file
    try {
      const componentCode = generateArticleComponent(frontmatter);
      const componentName = frontmatter.id
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      await createFileOnGitHub(
        `src/components/${componentName}.jsx`,
        componentCode,
        `✨ Create component: ${componentName}`
      );
      console.log(`✅ Component created: ${componentName}.jsx`);
    } catch (error) {
      console.error('Error creating component:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Impossible de créer le composant React',
          details: error.message
        })
      };
    }

    // Update main.jsx
    try {
      await updateMainJsx(frontmatter);
      console.log(`✅ Routes updated in main.jsx`);
    } catch (error) {
      console.error('Error updating main.jsx:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Impossible de mettre à jour main.jsx',
          details: error.message
        })
      };
    }

    // Update Google Sheets
    const sheetUpdated = await updateGoogleSheet(frontmatter);

    // Send Telegram notification
    const notificationSent = await sendTelegramNotification(frontmatter);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        status: 'success',
        message: 'Article publié avec succès',
        article: {
          id: frontmatter.id,
          title: frontmatter.title,
          url: `https://projectview.fr/article/${frontmatter.id}`
        },
        integrations: {
          github: 'success',
          sheets: sheetUpdated ? 'success' : 'skipped',
          telegram: notificationSent ? 'success' : 'skipped'
        }
      })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 'error',
        message: 'Erreur serveur interne',
        details: error.message
      })
    };
  }
};
