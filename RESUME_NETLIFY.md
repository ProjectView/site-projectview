# 📋 Résumé Complet - Étapes pour Netlify

**Version française simplifiée avec Netlify**

---

## 🎯 Ce Que Tu Dois Faire (Avec Netlify)

### 🚀 **ÉTAPE 1: Obtenir un Token GitHub** (5 minutes)

1. **Va sur**: https://github.com/settings/tokens
2. **Clique**: "Generate new token" → "Generate new token (classic)"
3. **Sélectionne**:
   - ✅ `repo`
   - ✅ `workflow`
4. **Génère** et **copie** le token

### 🔐 **ÉTAPE 2: Ajouter à Netlify** (3 minutes)

1. **Va sur**: https://app.netlify.com
2. **Clique** ton site Projectview
3. **Va sur**: Site settings → Build & deploy → Environment
4. **Ajoute 3 variables**:
   ```
   GITHUB_TOKEN = [ton token]
   GITHUB_REPO_OWNER = adelinhugot
   GITHUB_REPO_NAME = site-projectview
   ```
5. **Save** et **redéploie** le site

### 🔗 **ÉTAPE 3: Trouver ton URL Netlify** (1 minute)

Ton endpoint sera:
```
https://TON-SITE.netlify.app/.netlify/functions/n8n-webhook
```

**Remplace `TON-SITE` par le domaine de ton site.**

**Exemple**: `https://projectview-site.netlify.app/.netlify/functions/n8n-webhook`

### 🧪 **ÉTAPE 4: Tester le Webhook** (2 minutes)

**Lance dans le terminal** (adapte ton URL):

```bash
curl -X POST https://TON-SITE.netlify.app/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test\"\ntitle: \"Test\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test",
    "frontmatter": {"id": "test", "title": "Test", "category": "Guide Informatif", "date": "2025-10-26", "tags": ["test"], "author": "ProjectBot"},
    "approved": false
  }'
```

**Si tu vois**: `pending_approval` → ✅ C'est bon!

---

## 📊 **ÉTAPE 5 (OPTIONNEL): Google Sheets** (15 minutes)

Lis `BACKEND_SETUP_GUIDE.md` étape 2, puis ajoute à Netlify:

1. Netlify → ton site → Site settings → Environment
2. Ajoute 2 variables:
   ```
   GOOGLE_SHEETS_API_KEY = [JSON complet]
   GOOGLE_SHEETS_SPREADSHEET_ID = 13V4v7C3pECzAUaeSN7o3YxSBoY_JD2z23M_--xPP1fw
   ```
3. Save et redéploie

---

## 💬 **ÉTAPE 6 (OPTIONNEL): Telegram** (5 minutes)

Lis `BACKEND_SETUP_GUIDE.md` étape 3, puis ajoute à Netlify:

1. Netlify → ton site → Site settings → Environment
2. Ajoute 2 variables:
   ```
   TELEGRAM_BOT_TOKEN = [ton token]
   TELEGRAM_CHAT_ID = [ton chat ID]
   ```
3. Save et redéploie

---

## 🔄 **ÉTAPE 7: N8N Configuration** (10 minutes)

Dans N8N ProjectBot, ajoute un nœud "HTTP Request":

```
Méthode: POST
URL: https://TON-SITE.netlify.app/.netlify/functions/n8n-webhook

Corps:
{
  "articleMarkdown": "{{ $node.ArticleWriter.json.fullMarkdown }}",
  "frontmatter": {{ $node.ArticleWriter.json.frontmatter }},
  "nanobananaPrompts": {{ $node.ArticleWriter.json.prompts }},
  "approved": {{ $node.ApprovalNode.json.approved }}
}
```

---

## ⏱️ Temps Total

- **Minimum (juste GitHub)**: ~12 minutes
- **Complet (tout configuré)**: ~45 minutes

---

## ✅ Checklist Finale

- [ ] Token GitHub obtenu
- [ ] Netlify: 3 variables GitHub ajoutées
- [ ] Site redéployé
- [ ] Webhook testé avec curl
- [ ] (Optionnel) Google Sheets configuré
- [ ] (Optionnel) Telegram configuré
- [ ] N8N HTTP node configuré
- [ ] Premier article publié et visible

---

## 🎯 Différence Clé: URL du Webhook

| Plateforme | URL |
|-----------|-----|
| **Vercel** | `https://site.vercel.app/api/n8n-webhook` |
| **Netlify** | `https://site.netlify.app/.netlify/functions/n8n-webhook` |

**C'est la SEULE différence!** Tout le reste est identique.

---

## 🚀 Commence Maintenant!

Commence par l'**ÉTAPE 1** et tu auras tout en moins d'une heure! 💪

**Questions?** Lis `NETLIFY_SETUP.md` pour plus de détails.
