# Quick Start: Webhook Integration

**Status**: ✅ Webhook is live and ready for N8N integration

---

## 1-Minute Overview

1. **Webhook URL**: `https://projectview.fr/.netlify/functions/n8n-webhook`
2. **Method**: POST with JSON body
3. **What happens**: Article is created in GitHub → Auto-deployed to projectview.fr
4. **Time to live**: ~45 seconds after webhook call

---

## N8N Setup (5 minutes)

### Step 1: Add HTTP Request Node
- Add an "HTTP Request" node to your workflow
- Name: "Publish Article to ProjectView"

### Step 2: Configure Node
```
URL: https://projectview.fr/.netlify/functions/n8n-webhook
Method: POST
Headers: Content-Type: application/json
```

### Step 3: Set Body (Raw JSON)
```json
{
  "articleMarkdown": "{{ $node.YourArticleNode.json.markdown }}",
  "frontmatter": {{ $node.YourArticleNode.json.frontmatter }},
  "approved": {{ $node.ApprovalNode.json.approved }}
}
```

### Step 4: Test
- Send test article with `approved: false`
- Should get response: `"status": "pending_approval"`
- Then send with `approved: true`
- Should get: `"status": "success"` + live URL

---

## JSON Payload Structure

### Minimum Required
```json
{
  "articleMarkdown": "---\nid: \"article-slug\"\ntitle: \"Title\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"tag1\"]\nauthor: \"ProjectBot\"\n---\n\n# Title\n\nContent",
  "frontmatter": {
    "id": "article-slug",
    "title": "Title",
    "category": "Guide Informatif",
    "date": "2025-10-26",
    "tags": ["tag1"],
    "author": "ProjectBot"
  },
  "approved": true
}
```

### Full Format (Optional Fields)
```json
{
  "articleMarkdown": "...",
  "frontmatter": {
    "id": "article-slug",
    "title": "Title",
    "category": "Guide Informatif",
    "date": "2025-10-26",
    "tags": ["tag1", "tag2"],
    "author": "ProjectBot",
    "seoKeywords": ["keyword1", "keyword2"],
    "description": "Article summary",
    "imageHero": "/images/article-slug-hero.png"
  },
  "nanobananaPrompts": [
    {
      "name": "Hero",
      "prompt": "Image prompt text...",
      "width": 1920,
      "height": 1080
    }
  ],
  "approved": true
}
```

---

## Important Rules

### Article ID (kebab-case)
✅ Correct: `ecrans-collaboratifs`, `guide-vr-2025`
❌ Wrong: `Écrans Collaboratifs`, `ecrans_collaboratifs`

### Categories (pick one)
- Guide Informatif
- Guide Pratique
- Success Story
- Étude de Cas
- Analyse

### Dates
- Format: `YYYY-MM-DD`
- Example: `2025-10-26`

---

## What Happens

```
N8N sends POST
    ↓
Webhook validates
    ↓
Creates files in GitHub:
  ├─ src/content/articles/{id}.md
  ├─ src/components/{ComponentName}.jsx
  └─ updates src/main.jsx
    ↓
GitHub push triggers Netlify build
    ↓
Netlify deploys (2-3 minutes)
    ↓
Article live at:
  https://projectview.fr/article/{id}
```

---

## Responses

### Success (published - 201)
```json
{
  "status": "success",
  "message": "Article publié avec succès",
  "article": {
    "id": "article-slug",
    "title": "Article Title",
    "url": "https://projectview.fr/article/article-slug"
  }
}
```

### Pending Approval (draft - 200)
```json
{
  "status": "pending_approval",
  "message": "Article sauvegardé en brouillon..."
}
```

### Error (400/500)
```json
{
  "status": "error",
  "message": "Error description",
  "details": "Details..."
}
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `ID must be kebab-case` | Use: `my-article` (not `MyArticle` or `my_article`) |
| `Missing required fields` | Check: `id`, `title`, `category`, `date` |
| Invalid JSON | Use N8N JSON editor, not manual text |
| `sha wasn't supplied` | Webhook handles this - your data is fine |

---

## Test Commands

### Test Draft
```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test\"\ntitle: \"Test\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test",
    "frontmatter": {"id": "test", "title": "Test", "category": "Guide Informatif", "date": "2025-10-26", "tags": ["test"], "author": "ProjectBot"},
    "approved": false
  }'
```

### Test Publish
```bash
curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test-live\"\ntitle: \"Test Live\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test",
    "frontmatter": {"id": "test-live", "title": "Test Live", "category": "Guide Informatif", "date": "2025-10-26", "tags": ["test"], "author": "ProjectBot"},
    "approved": true
  }'
```

---

## Verify It Works

1. **Check response**: Should have `"status": "success"`
2. **Wait 45 seconds**: For Netlify to deploy
3. **Visit URL**: `https://projectview.fr/article/{id}`
4. **See article**: Should display with formatting
5. **Check GitHub**: https://github.com/ProjectView/site-projectview/commits/main

---

## Full Documentation

- **Setup details**: `N8N_WEBHOOK_CONFIG.md`
- **System overview**: `N8N_INTEGRATION_SUMMARY.md`
- **Production status**: `WEBHOOK_LIVE_SUMMARY.md`

---

**Ready to integrate?** Start with Step 1 above! 🚀
