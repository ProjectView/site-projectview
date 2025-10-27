# 🚀 Guide Setup ProjectBot - Automatisation Articles

Ce guide t'explique comment configurer complètement le système d'automatisation d'articles avec N8N → Netlify → GitHub.

## 📋 Checklist d'installation

- [ ] Étape 1: Authentification Netlify
- [ ] Étape 2: Configuration des variables d'environnement
- [ ] Étape 3: Préparation du token GitHub
- [ ] Étape 4: Import du workflow N8N
- [ ] Étape 5: Test du système

---

## Étape 1: Authentification Netlify 🔐

### Option A: Avec login interactif (Recommandé)

```bash
netlify login
```

Cela ouvrira un navigateur. Authentifie-toi avec ton compte Netlify, puis reviens au terminal.

### Option B: Avec un token (Si Option A ne marche pas)

1. Va sur: https://app.netlify.com/user/applications/personal-access-tokens
2. Crée un nouveau Personal Access Token
3. Copie le token
4. Dans le terminal:

```bash
export NETLIFY_AUTH_TOKEN="ton-token-ici"
netlify link
```

Puis sélectionne le site "site-projectview" (ou crée-le si nécessaire).

---

## Étape 2: Configuration des variables d'environnement 🔧

### Méthode 1: Script automatique (Recommandé)

```bash
python setup-netlify-env.py
```

Le script va te demander les infos nécessaires et les configurer automatiquement.

### Méthode 2: Manuel avec CLI

```bash
netlify env:set GITHUB_TOKEN "ton-github-token"
netlify env:set GITHUB_REPO_OWNER "ProjectView"
netlify env:set GITHUB_REPO_NAME "site-projectview"
```

### Vérifier les variables

```bash
netlify env:list
```

Tu devrais voir quelque chose comme:

```
┌─────────────────────────────────────┬─────────────────────┐
│ Name                                │ Value               │
├─────────────────────────────────────┼─────────────────────┤
│ GITHUB_TOKEN                        │ ghp_xxxxxxxxxxxx    │
│ GITHUB_REPO_OWNER                   │ ProjectView         │
│ GITHUB_REPO_NAME                    │ site-projectview    │
└─────────────────────────────────────┴─────────────────────┘
```

---

## Étape 3: Préparation du token GitHub 🔑

### Créer un GitHub Personal Access Token

1. Va sur: https://github.com/settings/tokens/new
2. Configure les permissions:
   - ✅ `repo` (accès complet aux repos privés et publics)
   - ✅ `workflow` (modifier les fichiers GitHub Actions)
3. Clique "Generate token"
4. **COPIE le token immédiatement** (tu ne pourras pas le voir à nouveau)
5. Utilise ce token dans l'Étape 2

### Permissions minimales requises:

```
☑ repo              (pour créer/modifier des fichiers)
  ☑ repo:status     (statut des commits)
  ☑ repo_deployment (déploiements)
  ☑ public_repo     (repos publics)
  ☑ repo:invite     (invitations)
```

---

## Étape 4: Import du workflow N8N 📦

### Récupérer le workflow modifié

Le fichier est dans: `N8N_WORKFLOW_UPDATED.json`

### L'importer dans N8N:

1. Ouvre N8N
2. Va dans "Workflows"
3. Clique "Import from file"
4. Sélectionne `N8N_WORKFLOW_UPDATED.json`
5. Remplace les anciens nodes par les nouveaux:
   - "Projectbot" (prompt mis à jour)
   - "Rédacteur en Chef - Markdown" (nouveau)
   - "Rédacteur JSX" (nouveau)

### Vérifier les connexions:

Les connexions suivantes doivent exister:

```
Telegram Trigger → Projectbot
Schedule Trigger → Projectbot
Discussion (Tool) → Projectbot
Rédacteur en Chef - Markdown (Tool) → Projectbot
Rédacteur JSX (Tool) → Projectbot
HTTP Request (Tool) → Projectbot
Projectbot → Send a text message
```

---

## Étape 5: Test du système 🧪

### Test 1: Vérifier que le webhook fonctionne

```bash
# Test du webhook (remplace les valeurs)
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleContent": "---\nid: \"test-article\"\ntitle: \"Test Article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-28\"\ntags: [\"test\"]\nauthor: \"Test\"\n---\n\n# Test\n\nCeci est un test.",
    "format": "markdown",
    "approved": false
  }'
```

Réponse attendue:

```json
{
  "status": "pending_approval",
  "message": "Article sauvegardé en brouillon...",
  "article": {
    "id": "test-article",
    "title": "Test Article",
    "format": "markdown"
  }
}
```

### Test 2: Vérifier Netlify Functions

```bash
netlify functions:list
```

Tu devrais voir:

```
n8n-webhook
```

### Test 3: Test via Telegram

1. Envoie un message à ProjectBot sur Telegram
2. Il devrait répondre avec les 3 idées d'articles
3. Choisis une idée (ex: "1")
4. Il va générer l'article
5. Choisis la version (ex: "2" pour JSX)
6. Il demande si tu veux publier
7. Réponds "oui"
8. L'article devrait être créé sur GitHub ! ✨

---

## Structure du flux complet 🔄

```
📱 Telegram
    ↓
🤖 N8N ProjectBot
    ↓
✍️ Rédacteur en Chef (Markdown ou JSX)
    ↓
📤 HTTP Request → Netlify Webhook
    ↓
🌐 GitHub API
    ├─ Crée src/content/articles/ID.md (ou src/components/Name.jsx)
    ├─ Update main.jsx avec import + route (si JSX)
    └─ Git commit automatique
    ↓
🔨 Vercel/Netlify Build
    ↓
🚀 Deploy
    ↓
✅ Article live sur projectview.fr/article/ID
```

---

## Troubleshooting 🔧

### Erreur: "Netlify CLI not found"

```bash
npm install -g netlify-cli
```

### Erreur: "Not logged in"

```bash
netlify login
# ou
export NETLIFY_AUTH_TOKEN="ton-token"
```

### Erreur: "GITHUB_TOKEN not found"

```bash
netlify env:list
# Si rien n'apparaît, définis les variables:
netlify env:set GITHUB_TOKEN "ton-token"
```

### Erreur GitHub API: "Bad credentials"

- Vérifie que le token GitHub est correct
- Vérifie qu'il a les permissions "repo"
- Génère un nouveau token si nécessaire

### Erreur: "Could not fetch main.jsx"

- Vérifie que GITHUB_REPO_OWNER et GITHUB_REPO_NAME sont corrects
- Vérifie que le token GitHub a les permissions repo

---

## Commandes utiles 🛠️

```bash
# Voir l'état du site
netlify status

# Lister les fonctions
netlify functions:list

# Voir les variables d'environnement
netlify env:list

# Tester un déploiement
netlify deploy --dry-run

# Voir les logs de la fonction
netlify functions:invoke n8n-webhook

# Redéployer manuellement
netlify deploy --prod
```

---

## Prochaines étapes 🚀

Une fois tout configuré:

1. **Teste avec un article simple** (markdown)
2. **Puis teste avec un article riche** (JSX)
3. **Automatise avec le Schedule Trigger** pour les idées du lundi
4. **Intègre les Google Sheets** pour tracker les articles publiés
5. **Ajoute Slack/Discord** pour les notifications

---

## Aide & Support

- **Docs Netlify CLI**: https://docs.netlify.com/cli/get-started/
- **Docs GitHub API**: https://docs.github.com/en/rest
- **Docs N8N**: https://docs.n8n.io/
- **Docs ProjectView**: Voir README.md du repo

---

**Créé avec ❤️ pour ProjectView**
