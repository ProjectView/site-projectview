# N8N Article Webhook Documentation

This document describes the webhook endpoint that integrates N8N ProjectBot with the Projectview website for automated article generation and publication.

## Endpoint

**URL**: `https://projectview-site.vercel.app/api/n8n-webhook`
**Method**: `POST`
**Content-Type**: `application/json`

## Request Body

```json
{
  "articleMarkdown": "---\nid: \"article-slug\"\ntitle: \"Article Title\"\n...\n---\n\n# Article content\n",
  "frontmatter": {
    "id": "article-slug",
    "title": "Article Title",
    "category": "Guide Informatif",
    "categoryColor": "#72B0CC",
    "date": "2025-10-26",
    "tags": ["Tag1", "Tag2", "Tag3"],
    "seoKeywords": ["keyword1", "keyword2"],
    "author": "ProjectBot",
    "imageHero": "/images/article-slug-hero.png",
    "imageSources": [
      { "section": "section_1", "url": "/images/article-slug-section1.png" }
    ]
  },
  "nanobananaPrompts": [
    {
      "name": "Hero - Article introduction",
      "position": "hero",
      "prompt": "...",
      "negative_prompt": "...",
      "height": 1080,
      "width": 1920,
      "steps": 45,
      "guidance_scale": 8,
      "seed": null
    }
  ],
  "approved": true
}
```

### Field Descriptions

- **articleMarkdown** (string, required): Full article content with YAML frontmatter
- **frontmatter** (object, required): Parsed frontmatter metadata
  - **id** (string, required): URL-safe article slug (kebab-case)
  - **title** (string, required): Article title
  - **category** (string, required): Article category (Guide Informatif, Guide Pratique, Success Story, Étude de Cas, Analyse)
  - **categoryColor** (string): Hex color for category badge
  - **date** (string): Publication date (ISO format: YYYY-MM-DD)
  - **tags** (array): Article tags (max 3-5)
  - **seoKeywords** (array): SEO keywords
  - **author** (string): Author name
  - **imageHero** (string): Hero image URL
  - **imageSources** (array): Additional images for sections

- **nanobananaPrompts** (array): Image generation prompts for Nano Banana
- **approved** (boolean): Whether article is approved for publication

## Response

### Success Response (201)

```json
{
  "status": "success",
  "message": "Article published successfully",
  "article": {
    "id": "article-slug",
    "title": "Article Title",
    "url": "https://projectview-site.vercel.app/article/article-slug"
  }
}
```

### Pending Approval Response (200)

```json
{
  "status": "pending_approval",
  "message": "Article saved as draft, awaiting approval from Adelin"
}
```

### Error Responses

**400 Bad Request**
```json
{
  "error": "Missing required fields"
}
```

**405 Method Not Allowed**
```json
{
  "error": "Method not allowed"
}
```

**500 Server Error**
```json
{
  "status": "error",
  "message": "Error description"
}
```

## What the Webhook Does

### 1. Validate Request
- Checks for required fields (articleMarkdown, frontmatter, id, title)
- Validates approval status

### 2. Save Article Markdown
- Creates `/src/content/articles/{article-id}.md`
- Stores complete Markdown content with YAML frontmatter

### 3. Generate React Component
- Creates `/src/components/{ArticleSlug}.jsx`
- Component imports article markdown and renders with ArticleRenderer
- Example:
  ```javascript
  import React from 'react';
  import ArticleRenderer from './ArticleRenderer';
  import articleContent from '@/content/articles/article-slug.md?raw';

  const ArticleSlug = () => {
    return <ArticleRenderer markdownContent={articleContent} />;
  };

  export default ArticleSlug;
  ```

### 4. Update Routes
- Adds new route to `/src/main.jsx`
- Route pattern: `/article/{article-id}`

### 5. Commit to GitHub
- Stages: article markdown, React component, main.jsx
- Commits with message: "📝 Add article: {title}"
- Pushes to main branch

### 6. Update Google Sheet
- Appends row to "Articles" sheet
- Columns: ID, Title, Date, Category, Tags, Topics, Keywords, Status, URL, Notes

## Environment Variables Required

Set these in Vercel dashboard or `.env.local`:

```bash
# GitHub API
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=site-projectview

# Google Sheets API
GOOGLE_SHEETS_API_KEY=AIza_xxxxxxxxxxxxx
GOOGLE_SHEETS_SPREADSHEET_ID=13V4v7C3pECzAUaeSN7o3YxSBoY_JD2z23M_--xPP1fw

# Optional - Telegram notifications
TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxx
TELEGRAM_CHAT_ID=xxxxxxxxxxxxx
```

## Setup Instructions

### 1. GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Scopes needed:
   - `repo` (full control)
   - `workflow` (update GitHub Action workflows)
4. Copy token and set `GITHUB_TOKEN` environment variable

### 2. Google Sheets API

1. Create service account at https://console.cloud.google.com
2. Create JSON key
3. Share Google Sheet with service account email
4. Set `GOOGLE_SHEETS_API_KEY` to JSON key content
5. Set `GOOGLE_SHEETS_SPREADSHEET_ID` to sheet ID

### 3. Deploy to Vercel

1. Push code to GitHub
2. Go to Vercel dashboard
3. Add environment variables
4. Vercel auto-deploys from GitHub

## Article ID Format

- Must be kebab-case: `article-slug-here`
- No spaces, special characters, or uppercase
- Examples:
  - ✅ `ecrans-collaboratifs`
  - ✅ `guide-presentation-vr`
  - ❌ `Ecrans Collaboratifs` (spaces and caps)
  - ❌ `ecrans_collaboratifs` (underscores)

## Testing

### Test Request with curl

```bash
curl -X POST \
  https://projectview-site.vercel.app/api/n8n-webhook \
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

## Troubleshooting

### GitHub Commit Fails
- Verify `GITHUB_TOKEN` has correct permissions
- Check repository name matches `GITHUB_REPO_NAME`
- Ensure branch exists (usually "main")

### Google Sheets Update Fails
- Verify sheet is shared with service account email
- Check `GOOGLE_SHEETS_SPREADSHEET_ID` is correct
- Ensure "Articles" sheet exists
- Check API key is valid

### Article Not Appearing on Site
- Run `npm run build` to verify build succeeds
- Check if component file was created correctly
- Verify route was added to main.jsx
- Clear browser cache

## N8N Integration

In N8N ProjectBot workflow:

1. Use HTTP Request node
2. Method: POST
3. URL: `https://projectview-site.vercel.app/api/n8n-webhook`
4. Body (JSON):
   ```json
   {
     "articleMarkdown": "{{$node.ArticleWriter.json.output}}",
     "frontmatter": "{{$node.ArticleWriter.json.frontmatter}}",
     "nanobananaPrompts": "{{$node.ArticleWriter.json.prompts}}",
     "approved": true
   }
   ```

5. On success, N8N gets article URL to send to Telegram

## Security Considerations

- GitHub token should be read-only for testing, full access for production
- Google Sheets API key should be restricted to Sheets API only
- Consider adding webhook signature validation (HMAC)
- Log all article publications for audit trail
- Monitor webhook endpoint for failed requests

## Future Enhancements

- [ ] Webhook signature validation
- [ ] Draft status tracking in separate sheet
- [ ] Automatic image uploads to Vercel blob storage
- [ ] Slack notifications on publication
- [ ] Article scheduling (publish at specific date/time)
- [ ] Automated SEO metadata generation
- [ ] Article preview before publication
