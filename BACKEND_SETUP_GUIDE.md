# Backend Setup Guide - N8N Article Webhook Integration

This guide walks through setting up the complete backend infrastructure for automated article generation from N8N ProjectBot.

## Overview

The system consists of:

1. **Vercel Function** (`api/n8n-webhook.js`): Webhook endpoint receiving articles from N8N
2. **GitHub Integration**: Automatic commits and pushes when articles are published
3. **Google Sheets API**: Dynamic article registry to track existing articles
4. **Telegram Notifications**: Notifies user when articles are published

## Architecture

```
N8N ProjectBot
    ↓ (POST JSON)
https://projectview-site.vercel.app/api/n8n-webhook
    ├─ Saves /src/content/articles/{slug}.md
    ├─ Generates /src/components/{ArticleSlug}.jsx
    ├─ Updates /src/main.jsx with new route
    ├─ Commits to GitHub (if configured)
    ├─ Updates Google Sheet registry (if configured)
    └─ Sends Telegram notification (if configured)
```

## Step-by-Step Setup

### 1. GitHub Token Setup

**Why**: Allows automated commits and pushes to your repository

**Steps**:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Set scopes:
   - ✅ `repo` - Full control of private and public repos
   - ✅ `workflow` - Update GitHub Action workflows
4. Click "Generate token"
5. **Copy the token immediately** (you won't see it again!)

**Store in Vercel**:
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add new variable:
   - Name: `GITHUB_TOKEN`
   - Value: (paste your GitHub token)

**Additional Variables**:
Also add these in the same section:
- `GITHUB_REPO_OWNER`: Your GitHub username
- `GITHUB_REPO_NAME`: Repository name (e.g., `site-projectview`)

### 2. Google Sheets API Setup

**Why**: Tracks existing articles to avoid duplicate topics and maintains article registry

**Steps**:

#### 2a. Create Google Cloud Project
1. Go to https://console.cloud.google.com
2. Create new project: "Projectview Article Registry"
3. Wait for creation to complete

#### 2b. Enable Sheets API
1. Search "Google Sheets API"
2. Click "Enable"
3. Wait for enablement

#### 2c. Create Service Account
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill form:
   - Service account name: `projectbot-articles`
   - Service account ID: (auto-filled)
   - Description: "N8N ProjectBot article automation"
4. Click "Create and Continue"
5. Grant these roles:
   - Editor
6. Click "Continue"
7. Click "Done"

#### 2d. Create JSON Key
1. Go to "APIs & Services" → "Credentials"
2. Find your service account → click it
3. Go to "Keys" tab
4. Click "Add Key" → "Create new key"
5. Select "JSON"
6. Click "Create"
7. **JSON file will download** - save it securely

#### 2e. Extract API Key
The downloaded JSON contains your credentials. Get the content for Vercel.

#### 2f. Share Google Sheet
1. Go to your Google Sheet: https://docs.google.com/spreadsheets/d/13V4v7C3pECzAUaeSN7o3YxSBoY_JD2z23M_--xPP1fw/
2. Click "Share"
3. Add email from service account JSON (`client_email` field)
4. Grant "Editor" permission
5. Click "Share"

#### 2g. Store in Vercel
Add these environment variables:
- `GOOGLE_SHEETS_API_KEY`: The entire JSON key (as string)
- `GOOGLE_SHEETS_SPREADSHEET_ID`: `13V4v7C3pECzAUaeSN7o3YxSBoY_JD2z23M_--xPP1fw`

### 3. Optional: Telegram Notifications

**Why**: Get instant notifications when articles are published

**Steps**:
1. Create a Telegram bot via @BotFather
   - Message `/newbot` to @BotFather
   - Follow prompts
   - Get your `BOT_TOKEN`
2. Get your chat ID:
   - Start a conversation with your bot
   - Visit: `https://api.telegram.org/bot{BOT_TOKEN}/getUpdates`
   - Look for `chat.id`

**Store in Vercel**:
- `TELEGRAM_BOT_TOKEN`: Your bot token
- `TELEGRAM_CHAT_ID`: Your chat ID

### 4. Verify Webhook URL

The webhook endpoint is automatically created by Vercel:

```
POST https://projectview-site.vercel.app/api/n8n-webhook
```

Test it with curl:
```bash
curl -X POST https://projectview-site.vercel.app/api/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test-article\"\ntitle: \"Test Article\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\"]\nauthor: \"ProjectBot\"\n---\n\n# Test Article\n\nThis is a test.",
    "frontmatter": {
      "id": "test-article",
      "title": "Test Article",
      "category": "Guide Informatif",
      "date": "2025-10-26",
      "tags": ["test"],
      "author": "ProjectBot"
    },
    "approved": true
  }'
```

## N8N Integration

### Add HTTP Request Node

In your N8N ProjectBot workflow:

1. Add new node: "HTTP Request"
2. Configure:
   - **Method**: POST
   - **URL**: `https://projectview-site.vercel.app/api/n8n-webhook`
   - **Body**: (select Raw)
   ```json
   {
     "articleMarkdown": "{{ $node.ArticleWriter.json.fullMarkdown }}",
     "frontmatter": {{ $node.ArticleWriter.json.frontmatter }},
     "nanobananaPrompts": {{ $node.ArticleWriter.json.prompts }},
     "approved": {{ $node.ApprovalNode.json.approved }}
   }
   ```

### Response Handling

The webhook returns different responses based on approval status:

**Approved (Success)**:
```json
{
  "status": "success",
  "message": "Article published successfully",
  "article": {
    "id": "article-slug",
    "title": "Article Title",
    "url": "https://projectview-site.vercel.app/article/article-slug"
  },
  "integrations": {
    "github": "success",
    "sheets": "success",
    "telegram": "success"
  }
}
```

**Pending Approval**:
```json
{
  "status": "pending_approval",
  "message": "Article saved as draft. Awaiting approval from Adelin before publication.",
  "article": {
    "id": "article-slug",
    "title": "Article Title"
  }
}
```

**Error**:
```json
{
  "status": "error",
  "message": "Error description",
  "details": "Additional error information"
}
```

## Google Sheet Structure

Your article registry should have these columns:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| ID | Title | Date | Category | Tags | Topics | Keywords | Status | URL | Notes |

**Example Row**:
```
ecrans-collaboratifs | Écrans collaboratifs : De la réunion chaotique... | 2025-10-26 | Guide Informatif | Écrans\|Collaboration\|Productivité | Guide Informatif | écrans collaboratifs\|réunions\|productivité | published | https://projectview-site.vercel.app/article/ecrans-collaboratifs | Generated by ProjectBot on 2025-10-26T10:30:00Z
```

## Article ID Format Rules

The `id` field in frontmatter must follow these rules:

✅ **Valid**:
- `ecrans-collaboratifs` (kebab-case)
- `guide-presentation-vr`
- `erreurs-reunion`
- `article-slug`

❌ **Invalid**:
- `Écrans Collaboratifs` (spaces, special chars, caps)
- `ecrans_collaboratifs` (underscores)
- `écrans collaboratifs` (spaces)

The webhook will reject invalid IDs with HTTP 400.

## Deployment

### Local Testing

Before deploying, test locally:

```bash
# Start dev server
npm run dev

# In another terminal, test webhook
curl -X POST http://localhost:3000/api/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Deploy to Vercel

1. Commit changes:
   ```bash
   git add api/ .env.example BACKEND_SETUP_GUIDE.md
   git commit -m "Add N8N webhook backend infrastructure"
   git push origin main
   ```

2. Vercel auto-deploys when you push to main

3. Verify deployment:
   - Go to Vercel dashboard
   - Check "Deployments" tab
   - Click latest deployment to see build logs
   - Check "Environment Variables" are set correctly

## Troubleshooting

### Webhook Fails with 500 Error

**Check logs**:
1. Go to Vercel dashboard → Deployments
2. Click "Functions" tab
3. Check `n8n-webhook` logs for errors

**Common Issues**:
- `GITHUB_TOKEN` expired or has wrong permissions
- File save path incorrect (check directory structure)
- `main.jsx` format changed unexpectedly

### Articles Not Appearing on Site

**Checklist**:
- [ ] Article markdown file created: `/src/content/articles/{id}.md`
- [ ] Component created: `/src/components/{ArticleSlug}.jsx`
- [ ] Route added to `/src/main.jsx`
- [ ] Build succeeded: `npm run build`
- [ ] Clear browser cache
- [ ] Check URL: `/article/{article-id}`

### Google Sheets Not Updating

**Check**:
1. Service account email is in share list of Google Sheet
2. `GOOGLE_SHEETS_SPREADSHEET_ID` is correct
3. "Articles" sheet exists in the spreadsheet
4. API key is valid JSON

### GitHub Commit Not Working

**Check**:
1. `GITHUB_TOKEN` has right permissions (`repo`, `workflow`)
2. Repository owner/name is correct
3. Branch exists and is named "main"
4. GitHub Actions are enabled

## Monitoring

### Check Webhook Activity

View recent webhook calls in Vercel:
1. Dashboard → Deployments → Functions
2. Select `n8n-webhook`
3. View "Logs" tab

### Check Git Commits

Verify articles were committed:
```bash
git log --oneline | grep "Add article"
```

### Check Google Sheet

The registry should have new rows automatically appended when articles are published.

## Next Steps

1. **Configure N8N workflow** to send HTTP requests to this webhook
2. **Test with draft article** (set `approved: false`)
3. **Test with approved article** (set `approved: true`)
4. **Monitor webhook logs** for any issues
5. **Update article registry** with existing articles if needed

## Security Considerations

- **GitHub Token**: Don't commit `.env.local` - keep tokens in Vercel only
- **Google Service Account**: Restrict to Sheets API only in Google Cloud console
- **Webhook Secrets**: Consider adding HMAC validation (future enhancement)
- **Rate Limiting**: Monitor for unusual webhook activity
- **Audit Trail**: All operations are logged in Vercel functions

## Support

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Review Vercel function logs
3. Verify all environment variables are set
4. Test webhook manually with curl
5. Check GitHub token permissions

For technical questions about the webhook implementation, refer to `/api/WEBHOOK_README.md`.
