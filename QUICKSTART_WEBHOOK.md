# Quick Start - N8N Webhook Integration

Get the N8N article automation system up and running in 15 minutes.

## Prerequisites

- Access to Vercel dashboard
- GitHub repository (already set up)
- Google Sheet: https://docs.google.com/spreadsheets/d/13V4v7C3pECzAUaeSN7o3YxSBoY_JD2z23M_--xPP1fw/

## 5-Minute Setup

### Step 1: GitHub Token (2 min)

1. Go to https://github.com/settings/tokens
2. "Generate new token (classic)"
3. Scopes: `repo` + `workflow`
4. Copy token

### Step 2: Add to Vercel (1 min)

1. Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add three variables:
   ```
   GITHUB_TOKEN = (paste token from step 1)
   GITHUB_REPO_OWNER = adelinhugot
   GITHUB_REPO_NAME = site-projectview
   ```

### Step 3: Test Webhook (2 min)

```bash
curl -X POST https://projectview-site.vercel.app/api/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test\"\ntitle: \"Test Article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test Article\n\nThis is a test.",
    "frontmatter": {
      "id": "test",
      "title": "Test Article",
      "category": "Guide Informatif",
      "date": "2025-10-26",
      "tags": ["test"],
      "author": "ProjectBot"
    },
    "approved": false
  }'
```

**Expected response**:
```json
{
  "status": "pending_approval",
  "message": "Article saved as draft..."
}
```

## Optional: Google Sheets + Telegram

### Add Google Sheets (3 min)

1. Go to https://console.cloud.google.com
2. Create Service Account
3. Create JSON key
4. Share Google Sheet with service account email
5. Add to Vercel:
   ```
   GOOGLE_SHEETS_API_KEY = (JSON key content)
   GOOGLE_SHEETS_SPREADSHEET_ID = 13V4v7C3pECzAUaeSN7o3YxSBoY_JD2z23M_--xPP1fw
   ```

### Add Telegram (2 min)

1. Message @BotFather on Telegram
2. `/newbot` → follow steps
3. Get `BOT_TOKEN`
4. Start conversation with bot
5. Visit: `https://api.telegram.org/bot{TOKEN}/getUpdates` → get `chat_id`
6. Add to Vercel:
   ```
   TELEGRAM_BOT_TOKEN = (your token)
   TELEGRAM_CHAT_ID = (your chat id)
   ```

## N8N Integration

### In N8N Workflow

Add HTTP Request node:

```
Method: POST
URL: https://projectview-site.vercel.app/api/n8n-webhook
Body (JSON):
{
  "articleMarkdown": "{{ $node.ArticleWriter.json.fullMarkdown }}",
  "frontmatter": {{ $node.ArticleWriter.json.frontmatter }},
  "nanobananaPrompts": {{ $node.ArticleWriter.json.prompts }},
  "approved": {{ $node.ApprovalNode.json.approved }}
}
```

## Test Full Flow

1. **Save draft** (approved: false)
   ```bash
   curl ... -d '{"articleMarkdown":"...", "approved": false}'
   ```
   → Article saved, NOT published

2. **Publish article** (approved: true)
   ```bash
   curl ... -d '{"articleMarkdown":"...", "approved": true}'
   ```
   → Article goes live at: `/article/{id}`

3. **Verify publication**
   - Check site: https://projectview-site.vercel.app/article/test
   - Check git: `git log | grep "Add article"`
   - Check Google Sheet: New row added

## View Example

Article rendering example (test article):
```
https://projectview-site.vercel.app/article/exemple-test
```

## Article Structure

Required fields in frontmatter:

```javascript
{
  "id": "kebab-case-slug",      // Required (lowercase, hyphens only)
  "title": "Article Title",      // Required
  "category": "Guide Informatif", // Required
  "date": "2025-10-26",          // Required
  "tags": ["tag1", "tag2"],      // Recommended
  "seoKeywords": ["kw1"],        // Recommended
  "author": "ProjectBot",        // Recommended
  "imageHero": "/images/slug.png" // Optional
}
```

## Common Issues

| Problem | Solution |
|---------|----------|
| 401 Error | Check GITHUB_TOKEN permissions |
| 400 Bad Request | Check article ID format (kebab-case) |
| Article not appearing | Run `npm run build`, clear cache |
| Git commit fails | Verify GITHUB_TOKEN and branch name |
| Google Sheets not updating | Share sheet with service account email |

## Documentation

- **Full Setup**: Read `BACKEND_SETUP_GUIDE.md`
- **API Docs**: Read `api/WEBHOOK_README.md`
- **Workflow**: Read `src/content/articles/WORKFLOW.md`
- **Article Format**: Read `src/content/articles/template-article.md`
- **Complete Overview**: Read `N8N_INTEGRATION_SUMMARY.md`

## File Checklist

Verify these files exist:

- ✅ `/api/n8n-webhook.js` - Main webhook handler
- ✅ `/src/components/ArticleRenderer.jsx` - Article renderer
- ✅ `/src/components/ArticleExempleTest.jsx` - Test component
- ✅ `/src/content/articles/` - Article storage directory
- ✅ `.env.example` - Environment variables template
- ✅ `/BACKEND_SETUP_GUIDE.md` - Detailed setup
- ✅ `/api/WEBHOOK_README.md` - API documentation
- ✅ `/N8N_INTEGRATION_SUMMARY.md` - System overview

## Next Steps

1. [ ] Add GitHub token to Vercel
2. [ ] Test webhook with curl
3. [ ] (Optional) Setup Google Sheets
4. [ ] (Optional) Setup Telegram
5. [ ] Configure N8N workflow
6. [ ] Test end-to-end article publication
7. [ ] Monitor first automated article

## Webhook Endpoint

```
POST https://projectview-site.vercel.app/api/n8n-webhook
Content-Type: application/json
```

**Status codes**:
- `201` - Article published successfully
- `200` - Article saved as draft
- `400` - Validation error
- `500` - Server error

## Support

For detailed instructions on any step, refer to:

- `BACKEND_SETUP_GUIDE.md` - Step-by-step setup for GitHub, Google Sheets, Telegram
- `api/WEBHOOK_README.md` - API reference and troubleshooting
- `N8N_INTEGRATION_SUMMARY.md` - System architecture and overview
