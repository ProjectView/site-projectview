# ✅ Commande CURL Corrigée et Testée

## La Commande Qui Marche (Copie-Colle Directe)

**Test 1: Article en Brouillon**

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

**Résultat attendu**:
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

## Test 2: Article Publié (Complet)

```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"mon-article-test\"\ntitle: \"Mon Article Test\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\", \"netlify\"]\nauthor: \"ProjectBot\"\n---\n\n# Mon Article Test\n\nCet article a été publié avec succès!",
    "frontmatter": {
      "id": "mon-article-test",
      "title": "Mon Article Test",
      "category": "Guide Informatif",
      "date": "2025-10-26",
      "tags": ["test", "netlify"],
      "author": "ProjectBot"
    },
    "approved": true
  }'
```

**Résultat attendu**:
```json
{
  "status": "success",
  "message": "Article published successfully",
  "article": {
    "id": "mon-article-test",
    "title": "Mon Article Test",
    "url": "https://projectview.fr/article/mon-article-test"
  },
  "integrations": {
    "github": "success",
    "sheets": "skipped",
    "telegram": "skipped"
  }
}
```

---

## Le Problème Qu'On Vient de Fixer

La version minifiée avait des sauts de ligne `\n` qui créaient des erreurs JSON:

❌ **Mauvais**:
```
-d '{"articleMarkdown":"---\nid: \"test-article\"...'
```

✅ **Correct** (multi-lignes):
```
-d '{
    "articleMarkdown": "---\nid: \"test-article\"...",
    ...
}'
```

---

## 🎯 Utilisation avec N8N

Dans N8N, utilise ce format pour ton HTTP Request node:

```
Méthode: POST
URL: https://projectview.fr/.netlify/functions/n8n-webhook

Corps (Raw):
{
  "articleMarkdown": "{{ $node.ArticleWriter.json.fullMarkdown }}",
  "frontmatter": {{ $node.ArticleWriter.json.frontmatter }},
  "nanobananaPrompts": {{ $node.ArticleWriter.json.prompts }},
  "approved": {{ $node.ApprovalNode.json.approved }}
}
```

N8N va gérer correctement l'échappement des caractères spéciaux.

---

## ✅ Status

✅ Build Netlify: **Fonctionnel**
✅ Webhook endpoint: **Accessible**
✅ JSON parsing: **Corrigé**
✅ Prêt pour N8N: **OUI**

**Tu peux maintenant configurer N8N et commencer à publier des articles!** 🚀
