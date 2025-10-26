/**
 * Netlify Function: N8N Webhook Handler
 *
 * Reçoit les données d'articles de N8N ProjectBot et:
 * 1. Sauvegarde le markdown de l'article dans /src/content/articles/{slug}.md
 * 2. Génère le composant React wrapper
 * 3. Met à jour main.jsx avec la nouvelle route
 * 4. Commit les changements sur GitHub
 * 5. Met à jour le registre Google Sheets
 *
 * Expected POST body:
 * {
 *   "articleMarkdown": "---\nid: ...\n---\n...",
 *   "frontmatter": { id, title, category, date, tags, ... },
 *   "nanobananaPrompts": [ { name, prompt, ... }, ... ],
 *   "approved": true/false
 * }
 *
 * Variables d'environnement requises:
 * - GITHUB_TOKEN: Token API GitHub pour les commits
 * - GOOGLE_SHEETS_API_KEY: Clé API Google Sheets
 * - GOOGLE_SHEETS_SPREADSHEET_ID: ID du Google Sheet
 * - GITHUB_REPO_OWNER: Propriétaire du repo GitHub
 * - GITHUB_REPO_NAME: Nom du repo GitHub
 */

const { writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

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
 * Sauvegarder le fichier markdown de l'article
 */
function saveArticle(articleMarkdown, frontmatter) {
  const articlePath = join(process.cwd(), 'src', 'content', 'articles', `${frontmatter.id}.md`);
  writeFileSync(articlePath, articleMarkdown, 'utf-8');
}

/**
 * Sauvegarder le composant React wrapper
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
 * Mettre à jour main.jsx avec la nouvelle route
 */
function updateMainJsx(frontmatter) {
  const componentName = frontmatter.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const mainPath = join(process.cwd(), 'src', 'main.jsx');
  let mainContent = readFileSync(mainPath, 'utf-8');

  // Ajouter l'import s'il n'existe pas
  if (!mainContent.includes(`import ${componentName}`)) {
    const importLine = `import ${componentName} from './components/${componentName}'`;
    const lastImportMatch = mainContent.match(/import .* from '\.\/components\/\w+'\n/g);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      mainContent = mainContent.replace(lastImport, lastImport + importLine + '\n');
    }
  }

  // Ajouter la route s'il n'existe pas
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
 * Commit les changements sur GitHub
 */
function commitToGitHub(frontmatter) {
  try {
    const articlePath = `src/content/articles/${frontmatter.id}.md`;
    const componentName = frontmatter.id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    const componentPath = `src/components/${componentName}.jsx`;

    // Ajouter les fichiers
    execSync(`git add "${articlePath}" "${componentPath}" src/main.jsx`, {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    // Créer le commit
    const commitMessage = `📝 Add article: ${frontmatter.title}`;
    execSync(`git commit -m "${commitMessage}"`, {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    // Pousser vers GitHub
    execSync('git push origin main', {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    return true;
  } catch (error) {
    console.error('Erreur git commit:', error.message);
    return false;
  }
}

/**
 * Mettre à jour le registre Google Sheets
 */
async function updateGoogleSheet(frontmatter) {
  if (!process.env.GOOGLE_SHEETS_API_KEY || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
    console.warn('⚠️ Google Sheets non configuré, mise à jour du registre ignorée');
    return false;
  }

  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Format: [ID, Titre, Date, Catégorie, Tags, Topics, Mots-clés, Statut, URL, Notes]
    const row = [
      frontmatter.id,
      frontmatter.title,
      frontmatter.date,
      frontmatter.category,
      (frontmatter.tags || []).join('|'),
      frontmatter.category,
      (frontmatter.seoKeywords || []).join('|'),
      'published',
      `https://netlify-site-url.netlify.app/article/${frontmatter.id}`,
      `Généré par ProjectBot le ${new Date().toISOString()}`
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
      console.error('Erreur Google Sheets API:', response.statusText);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Google Sheet mis à jour (${result.updates?.updatedCells} cellules)`);
    return true;
  } catch (error) {
    console.error('Erreur Google Sheets:', error.message);
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
🔗 URL: https://netlify-site-url.netlify.app/article/${frontmatter.id}
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
    console.error('Erreur notification Telegram:', error.message);
    return false;
  }
}

/**
 * Handler principal pour Netlify Function
 */
exports.handler = async (event, context) => {
  // Accepter les OPTIONS pour CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  // Accepter seulement les POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const { articleMarkdown, frontmatter, nanobananaPrompts, approved } = JSON.parse(event.body);

    // Valider les champs requis
    if (!articleMarkdown || !frontmatter || !frontmatter.id || !frontmatter.title) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          status: 'error',
          message: 'Champs manquants: articleMarkdown, frontmatter (avec id et title)'
        })
      };
    }

    // Valider le format de l'ID (kebab-case)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.id)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          status: 'error',
          message: 'ID d\'article invalide. Utilise kebab-case uniquement (ex: "article-slug")'
        })
      };
    }

    // Vérifier si l'article est approuvé
    if (!approved) {
      console.log(`📋 Brouillon d'article sauvegardé: ${frontmatter.title}`);
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
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

    // Sauvegarder le fichier markdown
    try {
      saveArticle(articleMarkdown, frontmatter);
      console.log(`✅ Article sauvegardé: ${frontmatter.id}.md`);
    } catch (error) {
      console.error('Erreur sauvegarde article:', error);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          status: 'error',
          message: 'Impossible de sauvegarder le markdown',
          details: error.message
        })
      };
    }

    // Générer et sauvegarder le composant React
    try {
      saveComponent(frontmatter);
      console.log(`✅ Composant créé: ${frontmatter.id}.jsx`);
    } catch (error) {
      console.error('Erreur création composant:', error);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          status: 'error',
          message: 'Impossible de créer le composant React',
          details: error.message
        })
      };
    }

    // Mettre à jour main.jsx
    try {
      updateMainJsx(frontmatter);
      console.log(`✅ Route ajoutée à main.jsx`);
    } catch (error) {
      console.error('Erreur mise à jour main.jsx:', error);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          status: 'error',
          message: 'Impossible de mettre à jour main.jsx',
          details: error.message
        })
      };
    }

    // Commit sur GitHub (si configuré)
    let gitCommitted = false;
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO_OWNER && process.env.GITHUB_REPO_NAME) {
      gitCommitted = commitToGitHub(frontmatter);
      if (gitCommitted) {
        console.log(`✅ Commit sur GitHub`);
      } else {
        console.warn('⚠️ Commit git échoué, mais l\'article est sauvegardé localement');
      }
    } else {
      console.warn('⚠️ GitHub non configuré, auto-commit ignoré');
    }

    // Mettre à jour Google Sheets (si configuré)
    const sheetUpdated = await updateGoogleSheet(frontmatter);

    // Envoyer notification Telegram (si configuré)
    const notificationSent = await sendTelegramNotification(frontmatter);

    return {
      statusCode: 201,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        status: 'success',
        message: 'Article publié avec succès',
        article: {
          id: frontmatter.id,
          title: frontmatter.title,
          url: `https://netlify-site-url.netlify.app/article/${frontmatter.id}`
        },
        integrations: {
          github: gitCommitted ? 'success' : 'skipped',
          sheets: sheetUpdated ? 'success' : 'skipped',
          telegram: notificationSent ? 'success' : 'skipped'
        }
      })
    };
  } catch (error) {
    console.error('Erreur webhook:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        status: 'error',
        message: 'Erreur serveur interne',
        details: error.message
      })
    };
  }
};
