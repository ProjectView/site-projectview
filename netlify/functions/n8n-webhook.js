/**
 * Netlify Function: N8N Webhook Handler (AMÉLIORÉ)
 *
 * Reçoit les données d'articles de N8N ProjectBot et:
 * 1. Gère MARKDOWN et JSX
 * 2. Crée les fichiers via l'API GitHub
 * 3. Met à jour main.jsx si c'est du JSX
 * 4. Met à jour le registre Google Sheets
 * 5. Envoie une notification Telegram
 *
 * Expected POST body (NEW FORMAT):
 * {
 *   "articleContent": "..." (markdown ou jsx),
 *   "format": "markdown" | "jsx",
 *   "approved": true/false
 * }
 *
 * ANCIEN FORMAT (ENCORE SUPPORTÉ):
 * {
 *   "articleMarkdown": "...",
 *   "frontmatter": { id, title, category, date, tags, ... },
 *   "approved": true/false
 * }
 */

/**
 * Extraire le frontmatter du contenu markdown
 */
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error('Markdown must start with valid YAML frontmatter (---...---)');
  }

  try {
    const yamlContent = match[1];
    // Parser simple du YAML
    const frontmatter = {};
    const lines = yamlContent.split('\n');

    lines.forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) return;

      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();

      // Parser les valeurs
      if (value === 'true') frontmatter[key] = true;
      else if (value === 'false') frontmatter[key] = false;
      else if (value.startsWith('[') && value.endsWith(']')) {
        frontmatter[key] = JSON.parse(value);
      }
      else if (value.startsWith('"') && value.endsWith('"')) {
        frontmatter[key] = value.slice(1, -1);
      }
      else {
        frontmatter[key] = value;
      }
    });

    return frontmatter;
  } catch (error) {
    throw new Error(`Invalid YAML in frontmatter: ${error.message}`);
  }
}

/**
 * Extraire l'ID et le titre du contenu JSX
 */
function extractMetadataFromJSX(jsxContent) {
  // Chercher const metadata = { ... }
  const metadataRegex = /const metadata = \{([^}]+)\}/;
  const match = jsxContent.match(metadataRegex);

  if (!match) {
    throw new Error('JSX must contain a metadata object: const metadata = { id, title, ... }');
  }

  const metadataStr = `{${match[1]}}`;
  try {
    // Parser simple
    const metadata = {};
    const content = match[1];

    const entries = content.split(',');
    entries.forEach(entry => {
      const [key, value] = entry.split(':').map(s => s.trim());
      if (!key) return;

      let parsedValue = value;
      if (value.startsWith('"') && value.endsWith('"')) {
        parsedValue = value.slice(1, -1);
      } else if (value === 'true') {
        parsedValue = true;
      } else if (value === 'false') {
        parsedValue = false;
      } else if (value.startsWith('[') && value.endsWith(']')) {
        parsedValue = JSON.parse(value);
      }

      metadata[key] = parsedValue;
    });

    return metadata;
  } catch (error) {
    throw new Error(`Could not parse metadata from JSX: ${error.message}`);
  }
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
 * Récupérer et mettre à jour main.jsx pour JSX
 */
async function updateMainJsxForArticle(articleId, metadata) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  const componentName = articleId
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
    const routePath = `/article/${articleId}`;
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
      `🔄 Update routes for article: ${metadata.title}`
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
async function updateGoogleSheet(metadata) {
  if (!process.env.GOOGLE_SHEETS_API_KEY || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    console.warn('⚠️ Google Sheets not configured, skipping registry update');
    return false;
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    const row = [
      metadata.id,
      metadata.title,
      metadata.date,
      metadata.category,
      (metadata.tags || []).join('|'),
      metadata.category,
      (metadata.seoKeywords || []).join('|'),
      'published',
      `https://projectview.fr/article/${metadata.id}`,
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
async function sendTelegramNotification(metadata) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return false;
  }

  try {
    const message = `
✅ **Article Publié!**

📝 **${metadata.title}**
📂 Catégorie: ${metadata.category}
🔗 URL: https://projectview.fr/article/${metadata.id}
📅 Date: ${metadata.date}

Tags: ${(metadata.tags || []).join(', ')}
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
    const requestBody = JSON.parse(event.body);

    // Supporter les deux formats
    let format = 'markdown';
    let articleContent = null;
    let metadata = null;
    let approved = requestBody.approved;

    // Format nouveau (N8N amélioré)
    if (requestBody.articleContent && requestBody.format) {
      articleContent = requestBody.articleContent;
      format = requestBody.format;

      if (format === 'markdown') {
        metadata = extractFrontmatter(articleContent);
      } else if (format === 'jsx') {
        metadata = extractMetadataFromJSX(articleContent);
      } else {
        throw new Error(`Invalid format: ${format}. Use "markdown" or "jsx"`);
      }
    }
    // Format ancien (compatibilité)
    else if (requestBody.articleMarkdown && requestBody.frontmatter) {
      articleContent = requestBody.articleMarkdown;
      metadata = requestBody.frontmatter;
      format = 'markdown';
    } else {
      throw new Error('Missing required fields: articleContent + format, or articleMarkdown + frontmatter');
    }

    // Validate required metadata
    if (!metadata.id || !metadata.title) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'Champs manquants: id et title dans metadata'
        })
      };
    }

    // Validate article ID format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.id)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          message: 'ID d\'article invalide. Utilise kebab-case uniquement (ex: "article-slug")'
        })
      };
    }

    // Check if approved
    if (!approved) {
      console.log(`📋 Article draft saved: ${metadata.title} (${format})`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'pending_approval',
          message: 'Article sauvegardé en brouillon. En attente d\'approbation d\'Adelin avant publication.',
          article: {
            id: metadata.id,
            title: metadata.title,
            format: format
          }
        })
      };
    }

    // Create article file based on format
    let filePath, commitMessage;

    if (format === 'markdown') {
      filePath = `src/content/articles/${metadata.id}.md`;
      commitMessage = `📝 Add article: ${metadata.title}`;

      try {
        await createFileOnGitHub(filePath, articleContent, commitMessage);
        console.log(`✅ Article markdown created: ${metadata.id}.md`);
      } catch (error) {
        console.error('Error creating markdown article:', error);
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
    } else if (format === 'jsx') {
      const componentName = metadata.id
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      filePath = `src/components/${componentName}.jsx`;
      commitMessage = `✨ Create component: ${metadata.title}`;

      try {
        await createFileOnGitHub(filePath, articleContent, commitMessage);
        console.log(`✅ Article JSX created: ${componentName}.jsx`);

        // Update main.jsx for JSX articles
        await updateMainJsxForArticle(metadata.id, metadata);
        console.log(`✅ main.jsx updated with route for ${metadata.id}`);
      } catch (error) {
        console.error('Error creating JSX article:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            status: 'error',
            message: 'Impossible de sauvegarder le composant JSX',
            details: error.message
          })
        };
      }
    }

    // Update Google Sheets
    const sheetUpdated = await updateGoogleSheet(metadata);

    // Send Telegram notification
    const notificationSent = await sendTelegramNotification(metadata);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        status: 'success',
        message: 'Article publié avec succès',
        article: {
          id: metadata.id,
          title: metadata.title,
          format: format,
          url: `https://projectview.fr/article/${metadata.id}`
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
