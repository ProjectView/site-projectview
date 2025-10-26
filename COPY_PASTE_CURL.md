# 🚀 COPIE-COLLE DIRECTE - Commande CURL pour projectview.fr

## Commande 1️⃣: Test Rapide (Article en Brouillon)

**Copie-colle directement dans ton terminal:**

```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook -H "Content-Type: application/json" -d '{"articleMarkdown":"---\nid: \"test-article\"\ntitle: \"Test Article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test Article\n\nCeci est un test.","frontmatter":{"id":"test-article","title":"Test Article","category":"Guide Informatif","date":"2025-10-26","tags":["test"],"author":"ProjectBot"},"approved":false}'
```

---

## Commande 2️⃣: Article Complet (Article Publié)

**Copie-colle directement dans ton terminal:**

```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook -H "Content-Type: application/json" -d '{"articleMarkdown":"---\nid: \"mon-premier-article\"\ntitle: \"Mon Premier Article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\",\"netlify\"]\nauthor: \"ProjectBot\"\n---\n\n# Mon Premier Article\n\nCet article a été publié avec succès via le webhook Netlify!","frontmatter":{"id":"mon-premier-article","title":"Mon Premier Article","category":"Guide Informatif","date":"2025-10-26","tags":["test","netlify"],"author":"ProjectBot"},"approved":true}'
```

---

## ⚡ Version Lisible (si tu veux l'adapter)

```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"id-de-larticle\"\ntitle: \"Titre de l'\''article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"tag1\",\"tag2\"]\nauthor: \"ProjectBot\"\n---\n\n# Titre\n\nContenu de l'\''article",
    "frontmatter": {
      "id": "id-de-larticle",
      "title": "Titre de l'\''article",
      "category": "Guide Informatif",
      "date": "2025-10-26",
      "tags": ["tag1","tag2"],
      "author": "ProjectBot"
    },
    "approved": true
  }'
```

---

## ✅ Quoi Vérifier

Si tu vois dans le résultat:

```json
"status": "success"
```

→ ✅ Succès! Article publié à `https://projectview.fr/article/id-de-larticle`

---

## 🔄 Pour N8N

L'URL à utiliser dans N8N est:

```
https://projectview.fr/.netlify/functions/n8n-webhook
```

**C'est tout!** 🎉
