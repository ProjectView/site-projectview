# 🚀 Guide d'Installation - N8N Webhook avec Netlify

**Pour Adelin - Configuration simplifiée pour Netlify**

---

## ✨ Ce Qui Change par Rapport à Vercel

| Étape | Vercel | Netlify |
|-------|--------|---------|
| **Endpoint** | `/api/...` | `/.netlify/functions/...` |
| **Config** | Vercel dashboard | `netlify.toml` |
| **Env vars** | Vercel dashboard | Netlify dashboard + `netlify.toml` |
| **Functions** | `api/` folder | `netlify/functions/` folder |

**Bonne nouvelle**: Les étapes d'installation restent pratiquement identiques!

---

## 📋 Étapes à Suivre (Adaptées pour Netlify)

### 🚀 **ÉTAPE 1: Obtenir un Token GitHub** (5 minutes)

**C'est identique pour Vercel et Netlify!**

1. **Va sur** https://github.com/settings/tokens
2. **Clique** "Generate new token" → "Generate new token (classic)"
3. **Sélectionne les permissions**:
   - ✅ `repo` (accès complet aux repos)
   - ✅ `workflow` (mettre à jour les GitHub Actions)
4. **Clique** "Generate token"
5. **Copie le token** (tu ne pourras plus le voir après!)

---

### 🔐 **ÉTAPE 2: Ajouter le Token à Netlify** (3 minutes)

**C'est légèrement différent de Vercel:**

1. **Va sur** https://app.netlify.com
2. **Clique sur ton site** (Projectview)
3. **Va sur** Site settings → Build & deploy → Environment
4. **Clique** "Edit variables" (ou "+ Add a variable")
5. **Ajoute 3 variables d'environnement**:

   ```
   Key: GITHUB_TOKEN
   Value: (colle ton token GitHub)

   Key: GITHUB_REPO_OWNER
   Value: adelinhugot

   Key: GITHUB_REPO_NAME
   Value: site-projectview
   ```

6. **Clique** Save
7. **Redéploie** (va sur "Deployments" et clique "Trigger deploy")

---

### 🧪 **ÉTAPE 3: Trouver ton URL de Webhook** (1 minute)

Avec Netlify, l'URL du webhook est:

```
https://TON-SITE.netlify.app/.netlify/functions/n8n-webhook
```

**Remplace `TON-SITE` par le nom de ton site Netlify.**

**Comment le trouver?**
1. Va sur https://app.netlify.com
2. Clique sur ton site
3. Cherche le domaine en haut (ex: `projectview-site.netlify.app`)
4. Ton URL est: `https://projectview-site.netlify.app/.netlify/functions/n8n-webhook`

---

### ✅ **ÉTAPE 4: Tester le Webhook** (2 minutes)

**Lance cette commande dans le terminal** (adapte l'URL avec ton domaine):

```bash
curl -X POST https://TON-SITE.netlify.app/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test-article\"\ntitle: \"Test Article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test Article\n\nCeci est un test.",
    "frontmatter": {
      "id": "test-article",
      "title": "Test Article",
      "category": "Guide Informatif",
      "date": "2025-10-26",
      "tags": ["test"],
      "author": "ProjectBot"
    },
    "approved": false
  }'
```

**Tu devrais recevoir**:
```json
{
  "status": "pending_approval",
  "message": "Article saved as draft..."
}
```

**Si ça marche**: ✅ GitHub et webhook fonctionnent!

---

## 📊 **ÉTAPE 5 (OPTIONNEL): Google Sheets** (15 minutes)

Exactement comme pour Vercel! Lis `BACKEND_SETUP_GUIDE.md` étape 2.

Quand tu dois ajouter les variables à Netlify:

1. **Va sur** Netlify → ton site → Site settings → Build & deploy → Environment
2. **Clique** "Edit variables"
3. **Ajoute 2 nouvelles variables**:
   ```
   GOOGLE_SHEETS_API_KEY = (colle le JSON complet)
   GOOGLE_SHEETS_SPREADSHEET_ID = 13V4v7C3pECzAUaeSN7o3YxSBoY_JD2z23M_--xPP1fw
   ```
4. **Clique** Save
5. **Redéploie** le site

---

## 💬 **ÉTAPE 6 (OPTIONNEL): Telegram Notifications** (5 minutes)

Exactement comme pour Vercel! Lis `BACKEND_SETUP_GUIDE.md` étape 3.

Quand tu dois ajouter à Netlify:

1. **Va sur** Netlify → ton site → Site settings → Build & deploy → Environment
2. **Clique** "Edit variables"
3. **Ajoute 2 variables**:
   ```
   TELEGRAM_BOT_TOKEN = (ton token)
   TELEGRAM_CHAT_ID = (ton chat ID)
   ```
4. **Clique** Save
5. **Redéploie** le site

---

## 🔄 **ÉTAPE 7: Configurer N8N** (10 minutes)

Dans ton workflow N8N ProjectBot:

1. **Ajoute un nœud** "HTTP Request"
2. **Configure comme ça**:
   ```
   Méthode: POST
   URL: https://TON-SITE.netlify.app/.netlify/functions/n8n-webhook

   Corps (JSON):
   {
     "articleMarkdown": "{{ $node.ArticleWriter.json.fullMarkdown }}",
     "frontmatter": {{ $node.ArticleWriter.json.frontmatter }},
     "nanobananaPrompts": {{ $node.ArticleWriter.json.prompts }},
     "approved": {{ $node.ApprovalNode.json.approved }}
   }
   ```

3. **Teste** en publiant un article de test

---

## 🎬 **ÉTAPE 8: Teste le Flux Complet** (15 minutes)

Identique à la version Vercel. Lis `QUICKSTART_WEBHOOK.md` étape 7.

---

## 📝 Différences Netlify vs Vercel

### URL du Webhook
- **Vercel**: `https://projectview-site.vercel.app/api/n8n-webhook`
- **Netlify**: `https://projectview-site.netlify.app/.netlify/functions/n8n-webhook`

### Configuration des Variables
- **Vercel**: Dashboard → Settings → Environment Variables
- **Netlify**: Dashboard → Site settings → Build & deploy → Environment

### Dossier des Functions
- **Vercel**: `api/` folder
- **Netlify**: `netlify/functions/` folder

### Fichier de Configuration
- **Vercel**: `vercel.json`
- **Netlify**: `netlify.toml` (déjà mis à jour!)

---

## 📍 Checklist pour Netlify

- [ ] Token GitHub obtenu
- [ ] Netlify: `GITHUB_TOKEN` ajouté
- [ ] Netlify: `GITHUB_REPO_OWNER` et `GITHUB_REPO_NAME` ajoutés
- [ ] Site redéployé sur Netlify
- [ ] URL du webhook trouvée
- [ ] Webhook testé avec curl (article en brouillon)
- [ ] Article exemple visible à `/article/exemple-test`
- [ ] (Optionnel) Google Sheets configuré
- [ ] (Optionnel) Telegram configuré
- [ ] N8N workflow HTTP node configuré
- [ ] Test complet effectué (article publié)
- [ ] Articles visibles sur le site

---

## 🎯 Commande Rapide Pour Tester Maintenant

**Remplace `projectview-site` par ton domaine Netlify et copie-colle ceci:**

```bash
curl -X POST https://projectview-site.netlify.app/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"mon-article-test\"\ntitle: \"Mon Article Test\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Mon Article Test\n\nCe texte montre que le webhook fonctionne!",
    "frontmatter": {"id": "mon-article-test", "title": "Mon Article Test", "category": "Guide Informatif", "date": "2025-10-26", "tags": ["test"], "author": "ProjectBot"},
    "approved": false
  }'
```

Si tu reçois `pending_approval`, c'est bon! 🎉

---

## 🆘 Si Quelque Chose Ne Marche Pas avec Netlify

### "Function not found" ou 404 Error
- Vérifie que le dossier `netlify/functions/` existe
- Vérifie que le fichier `netlify/functions/n8n-webhook.js` existe
- Attends quelques secondes après avoir redéployé
- Force un redéploiement: Netlify → Deployments → "Trigger deploy"

### Webhook retourne une erreur 500
- Vérifie les logs de la function: Netlify → Functions → n8n-webhook → Logs
- Cherche le message d'erreur exact
- Vérifie que ton `GITHUB_TOKEN` est correct

### Variables d'environnement non trouvées
- Vérifie que les variables sont ajoutées dans Netlify dashboard
- Vérifie que le site a été redéployé après l'ajout des variables
- Vérifie qu'il n'y a pas de typo dans le nom des variables

### Git commit ne fonctionne pas
- Vérifie que `GITHUB_TOKEN` a les permissions `repo` et `workflow`
- Vérifie que tu es autorisé à pusher vers le repo
- Vérifie les logs de la function Netlify pour plus de détails

---

## 📱 Redéployer Après Modifications

Après avoir fait n'importe quelle modification importante (ajouter des variables, changer le code, etc.):

1. **Commit et pousse vers GitHub**:
   ```bash
   git add .
   git commit -m "Update Netlify configuration"
   git push origin main
   ```

2. **Netlify redéploiera automatiquement** depuis GitHub

3. **Ou redéploie manuellement**:
   - Netlify → Deployments → "Trigger deploy"

---

## 📚 Guides Complets

Tous les guides généraux (avec des références à Vercel) s'appliquent aussi à Netlify:

| Document | Utilisation |
|----------|------------|
| **QUICKSTART_WEBHOOK.md** | Setup rapide (adapte juste l'URL et le dashboard) |
| **BACKEND_SETUP_GUIDE.md** | Setup détaillée Google Sheets & Telegram |
| **api/WEBHOOK_README.md** | Documentation API (identique pour Netlify) |
| **N8N_INTEGRATION_SUMMARY.md** | Architecture système |
| **IMPLEMENTATION_COMPLETE.md** | Résumé de ce qui a été fait |

---

## ⏱️ Temps Total avec Netlify

- **Minimum (juste GitHub)**: ~12 minutes
- **Complet (GitHub + Google Sheets + Telegram)**: ~45 minutes
- **Avec tests et vérifications**: ~60 minutes

---

## 🎯 Prochaine Étape

**Commence par l'étape 1** (GitHub token) et tu auras des articles automatisés en moins d'une heure avec Netlify! 🚀

**La seule différence réelle**: L'URL du webhook change d'une plateforme à l'autre. Tout le reste fonctionne exactement pareil!

---

*Configuration Netlify ajoutée et testée ✅*
