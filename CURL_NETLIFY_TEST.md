# 🧪 Commande CURL pour Tester le Webhook Netlify

## Pour projectview.fr

### ✅ Test 1: Article en Brouillon (Test Simple)

**Copie-colle cette commande:**

```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
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

**Résultat attendu:**
```json
{
  "status": "pending_approval",
  "message": "Article saved as draft. Awaiting approval from Adelin before publication.",
  "article": {
    "id": "test-article",
    "title": "Test Article"
  }
}
```

---

### ✅ Test 2: Article Publié (Test Complet)

**Copie-colle cette commande:**

```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test-article-live\"\ntitle: \"Test Article Live\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test Article Live\n\nCet article a été publié avec succès!",
    "frontmatter": {
      "id": "test-article-live",
      "title": "Test Article Live",
      "category": "Guide Informatif",
      "date": "2025-10-26",
      "tags": ["test"],
      "author": "ProjectBot"
    },
    "approved": true
  }'
```

**Résultat attendu:**
```json
{
  "status": "success",
  "message": "Article published successfully",
  "article": {
    "id": "test-article-live",
    "title": "Test Article Live",
    "url": "https://projectview.fr/article/test-article-live"
  },
  "integrations": {
    "github": "success",
    "sheets": "skipped",
    "telegram": "skipped"
  }
}
```

---

## 📍 Points Importants pour projectview.fr

### 1️⃣ URL du Webhook
```
https://projectview.fr/.netlify/functions/n8n-webhook
```

### 2️⃣ Vérifier le Déploiement Netlify

**Avant de tester**, assure-toi que:**

1. **Le site est bien déployé sur Netlify**:
   - Va sur https://app.netlify.com
   - Clique sur ton site (celui lié à projectview.fr)
   - Vérifie que le dernier déploiement est ✅ "Published"

2. **Les variables d'environnement sont configurées:**
   - Netlify → ton site → Site settings → Build & deploy → Environment
   - Vérifie que `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME` sont présentes

3. **Le site a été redéployé** après configuration:
   - Si tu as ajouté des variables d'env récemment
   - Va dans "Deployments" et clique "Trigger deploy"

### 3️⃣ Format de l'ID d'Article

L'ID doit être en **kebab-case** (minuscules, tirets seulement):
- ✅ `test-article`
- ✅ `mon-article-test`
- ✅ `guide-netlify`
- ❌ `Test Article` (espaces)
- ❌ `mon_article` (underscores)
- ❌ `MonArticle` (majuscules)

---

## 🧪 Procédure de Test Complète

### Étape 1: Tester le Brouillon
```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test-article\"\ntitle: \"Test Article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test Article\n\nCeci est un test.",
    "frontmatter": {"id": "test-article", "title": "Test Article", "category": "Guide Informatif", "date": "2025-10-26", "tags": ["test"], "author": "ProjectBot"},
    "approved": false
  }'
```

✅ Si tu vois `pending_approval` → C'est bon!

---

### Étape 2: Vérifier les Logs Netlify
1. Va sur https://app.netlify.com
2. Clique ton site
3. Va sur "Functions" → "n8n-webhook" → "Logs"
4. Cherche le message de test

---

### Étape 3: Publier l'Article
```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test-article-live\"\ntitle: \"Test Article Live\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test Article Live\n\nCet article a été publié avec succès!",
    "frontmatter": {"id": "test-article-live", "title": "Test Article Live", "category": "Guide Informatif", "date": "2025-10-26", "tags": ["test"], "author": "ProjectBot"},
    "approved": true
  }'
```

✅ Si tu vois `success` → L'article est publié!

---

### Étape 4: Vérifier sur le Site
1. **Article visible?** https://projectview.fr/article/test-article-live
2. **GitHub commit?** `git log | grep "Add article"`
3. **Google Sheets?** Nouvelle ligne (si configuré)

---

## 🆘 Troubleshooting

### Erreur: "Function not found" (404)
**Solutions:**
1. Attends quelques secondes après redéploiement
2. Vérifie que Netlify a bien déployé la version récente
3. Force un redéploiement: Netlify → Deployments → "Trigger deploy"

### Erreur: "GITHUB_TOKEN not found"
**Solutions:**
1. Vérifie que la variable est dans Netlify environment
2. Assure-toi que le site a été redéployé après ajout de la variable
3. Cherche dans les logs Netlify: Deployments → Logs

### Erreur: "Invalid article ID"
**Solution:**
- Change l'ID en kebab-case (minuscules, tirets seulement)
- Pas d'espaces, pas d'accents, pas d'underscores

### L'article n'apparaît pas sur le site
**Solutions:**
1. Attends quelques secondes (redéploiement Vercel/Netlify)
2. Vide le cache: Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)
3. Vérifie que `approved: true` dans la commande curl
4. Cherche dans les logs Netlify pour les erreurs

---

## 🔗 URLs Complètes pour projectview.fr

| Endpoint | URL |
|----------|-----|
| **Webhook** | `https://projectview.fr/.netlify/functions/n8n-webhook` |
| **Article Test** | `https://projectview.fr/article/test-article-live` |
| **Netlify Logs** | https://app.netlify.com |

---

## 💡 Notes pour projectview.fr

- ✅ Domaine personnalisé: `projectview.fr` fonctionne parfaitement
- ✅ Netlify: Les functions restent accessibles via `/.netlify/functions/`
- ✅ Même si c'est un domaine personnalisé, la structure reste identique

---

## 🚀 Une Fois Que Tu as Testé

1. **Configure ton N8N** avec l'URL: `https://projectview.fr/.netlify/functions/n8n-webhook`
2. **Publie ton premier article** via N8N
3. **Vérifie** qu'il apparaît sur https://projectview.fr/article/slug

**C'est tout!** 🎉

---

*Commands testées pour projectview.fr sur Netlify ✅*
