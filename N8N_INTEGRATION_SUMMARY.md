# N8N ProjectBot Integration - Complete Implementation Summary

This document provides an overview of the complete N8N ProjectBot integration system that enables automated article generation from Telegram through to live publication on the Projectview website.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    N8N PROJECTBOT (Telegram)                    │
│  - Reads Google Sheet for existing articles                     │
│  - Proposes 3 original article ideas                            │
│  - Waits for Adelin's selection                                 │
│  - Writes complete article in Markdown with YAML frontmatter   │
│  - Generates 3 Nano Banana image prompts                        │
│  - Requests approval before publication                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP POST
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│              VERCEL WEBHOOK: /api/n8n-webhook                    │
│  ✅ Validates article data                                       │
│  ✅ Saves Markdown file                                          │
│  ✅ Generates React wrapper component                            │
│  ✅ Updates routes in main.jsx                                   │
│  ✅ Commits to GitHub                                            │
│  ✅ Updates Google Sheet registry                                │
│  ✅ Sends Telegram confirmation                                  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                ↓              ↓              ↓
        ┌───────────────┐ ┌──────────┐ ┌─────────────┐
        │  GitHub Repo  │ │ Vercel   │ │ Google      │
        │  (committed)  │ │ (deploys)│ │ Sheets      │
        └───────────────┘ └──────────┘ │ (registry)  │
                               │       └─────────────┘
                               │ Auto-deploy
                               ↓
                        ┌──────────────────┐
                        │ Live Website     │
                        │ /article/slug    │
                        └──────────────────┘
```

## Files Created/Modified

### New Files

#### Frontend Infrastructure
- **`src/components/ArticleRenderer.jsx`** (300+ lines)
  - Parses YAML frontmatter from Markdown
  - Renders Markdown with react-markdown
  - Custom styling for all elements
  - Responsive design matching Projectview branding
  - Full page layout (nav, hero, content, CTA, chatbot)

- **`src/components/ArticleExempleTest.jsx`**
  - Test wrapper component
  - Shows how generated articles will be structured

- **`src/content/articles/`** (directory)
  - `exemple-article-test.md`: Full example article with all formats
  - `README.md`: Documentation for article format and conventions
  - `WORKFLOW.md`: Complete workflow diagram and specifications
  - `template-article.md`: Template for creating new articles

#### Backend Infrastructure
- **`api/n8n-webhook.js`** (375 lines)
  - Main webhook handler (Vercel Function)
  - Validates article data
  - Saves markdown files
  - Generates React components
  - Updates main.jsx routes
  - GitHub integration
  - Google Sheets integration
  - Telegram notifications

- **`api/lib/github.js`** (utility functions)
  - GitHub API utilities for commits
  - File staging, committing, and pushing

- **`api/lib/sheets.js`** (utility functions)
  - Google Sheets API utilities
  - Append articles to registry
  - Read existing articles

- **`api/WEBHOOK_README.md`** (comprehensive documentation)
  - Webhook endpoint documentation
  - Request/response formats
  - Environment variables
  - Setup instructions
  - Testing guide
  - Troubleshooting

#### Configuration & Documentation
- **`BACKEND_SETUP_GUIDE.md`** (step-by-step setup)
  - Complete setup walkthrough
  - GitHub token creation
  - Google Sheets API setup
  - Telegram configuration
  - N8N integration
  - Troubleshooting guide

- **`N8N_INTEGRATION_SUMMARY.md`** (this file)
  - System overview
  - Architecture diagram
  - Quick reference guide

- **`.env.example`** (updated)
  - Added webhook configuration variables
  - GitHub, Google Sheets, Telegram settings

### Modified Files

- **`src/main.jsx`**
  - Added import: `import ArticleExempleTest from './components/ArticleExempleTest'`
  - Added route: `<Route path="/article/exemple-test" element={<ArticleExempleTest />} />`
  - Ready for automatic route additions from webhook

- **`vercel.json`**
  - Already configured for Vercel Functions (no changes needed)

## How It Works

### 1. Article Proposal Phase (Monday 9 AM)

```
ProjectBot → Reads Google Sheet (existing articles)
          → Generates 3 ORIGINAL article ideas
          → Sends via Telegram: "Choose one: 1) ..., 2) ..., 3) ..."
          → Waits for Adelin's response
```

### 2. Article Writing Phase

```
Adelin → "Use idea #2"
      ↓
ProjectBot → Writes 800-1500 word article
          → Formats as Markdown with YAML frontmatter
          → Generates 3 Nano Banana image prompts (JSON)
          → Sends article to Telegram (split into messages)
          → Sends image prompts
          → Asks: "Publish? (yes/no)"
```

### 3. Image Generation Phase

```
Adelin → Goes to Nano Banana
      → Pastes the 3 prompts
      → Generates images
      → Saves to /public/images/article-slug-*.png
```

### 4. Publication Phase (User Approval)

```
Adelin → Confirms in Telegram: "yes"
      ↓
N8N → Sends HTTP POST to webhook with:
      - Full article Markdown
      - Parsed frontmatter
      - Image prompt metadata
      - approved: true
      ↓
Webhook receives POST → Validates → Saves files → Commits → Deploys
      ↓
Vercel auto-deploys
      ↓
Article LIVE: https://projectview-site.vercel.app/article/slug
```

## Content Structure

### Article Storage

**Markdown File**: `/src/content/articles/{article-id}.md`

```markdown
---
id: "article-slug"
title: "Article Title"
category: "Guide Informatif"
categoryColor: "#72B0CC"
date: "2025-10-26"
tags: ["Tag1", "Tag2", "Tag3"]
seoKeywords: ["keyword1", "keyword2"]
author: "ProjectBot"
imageHero: "/images/article-slug-hero.png"
imageSources: [
  { section: "section_1", url: "/images/article-slug-section1.png" }
]
---

# Article Title

Article content in Markdown...
```

### React Component (Auto-Generated)

**Component File**: `/src/components/{ArticleSlug}.jsx`

```javascript
import React from 'react';
import ArticleRenderer from './ArticleRenderer';
import articleContent from '@/content/articles/article-slug.md?raw';

const ArticleSlug = () => {
  return <ArticleRenderer markdownContent={articleContent} />;
};

export default ArticleSlug;
```

### Route (Auto-Added)

**In main.jsx**:
```javascript
<Route path="/article/article-slug" element={<ArticleSlug />} />
```

## API Endpoint

### Webhook URL
```
POST https://projectview-site.vercel.app/api/n8n-webhook
```

### Request Format
```json
{
  "articleMarkdown": "---\nid: \"slug\"\n...\n---\n\n# Content",
  "frontmatter": {
    "id": "article-slug",
    "title": "Title",
    "category": "Guide Informatif",
    "date": "2025-10-26",
    "tags": ["tag1", "tag2"],
    "seoKeywords": ["kw1", "kw2"],
    "author": "ProjectBot",
    "imageHero": "/images/article-slug-hero.png"
  },
  "nanobananaPrompts": [
    {
      "name": "Hero",
      "position": "hero",
      "prompt": "...",
      "width": 1920,
      "height": 1080
    }
  ],
  "approved": true
}
```

### Response (Success - 201)
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
    "telegram": "skipped"
  }
}
```

## Environment Variables Required

Set these in Vercel dashboard:

```bash
# GitHub (required for auto-commits)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_REPO_OWNER=adelinhugot
GITHUB_REPO_NAME=site-projectview

# Google Sheets (required for article registry)
GOOGLE_SHEETS_API_KEY=AIza_xxxxxxxxxxxxx (full JSON)
GOOGLE_SHEETS_SPREADSHEET_ID=13V4v7C3pECzAUaeSN7o3YxSBoY_JD2z23M_--xPP1fw

# Telegram (optional, for notifications)
TELEGRAM_BOT_TOKEN=xxxxxxxxxxxxx
TELEGRAM_CHAT_ID=xxxxxxxxxxxxx
```

## Article Categories

Supported categories (with default colors):

| Category | Color | Use Case |
|----------|-------|----------|
| Guide Informatif | #72B0CC | Educational content, explanations |
| Guide Pratique | #82BC6C | How-to guides, step-by-step |
| Success Story | #CF6E3F | Client case studies, wins |
| Étude de Cas | #72B0CC | Detailed analysis, research |
| Analyse | #CF6E3F | Industry trends, reports |

## Features Implemented

✅ **Markdown with YAML Frontmatter**
- Easy for bots to generate
- Version control friendly
- Separates content from presentation

✅ **Dynamic Article Rendering**
- Single ArticleRenderer component for all articles
- Supports all Markdown elements
- Responsive design
- Category-based color theming

✅ **Automatic File Generation**
- Markdown files saved to `/src/content/articles/`
- React wrapper components auto-generated
- Routes automatically added to main.jsx

✅ **GitHub Integration**
- Automatic commits on publication
- Commits include article, component, and route changes
- Push to main branch auto-triggers Vercel deployment

✅ **Google Sheets Registry**
- Tracks all published articles
- Prevents duplicate topic proposals
- Metadata: ID, title, date, category, tags, keywords, status, URL

✅ **Telegram Notifications**
- Confirmation when article goes live
- Includes article title, category, URL, date, tags

✅ **Image Management**
- Supports hero image (1920×1080 with 16:9 aspect ratio)
- Supports additional section images
- Uses /public/images/ directory
- Nano Banana prompt generation in JSON format

## Article ID Format

- **Required**: kebab-case (lowercase, hyphens only)
- **Examples**: `ecrans-collaboratifs`, `guide-presentation-vr`
- **Invalid**: `Écrans Collaboratifs`, `ecrans_collaboratifs`

## Testing

### Test the Webhook Locally

```bash
curl -X POST http://localhost:3000/api/n8n-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "articleMarkdown": "---\nid: \"test\"\ntitle: \"Test\"\n---\n\n# Test",
    "frontmatter": {"id": "test", "title": "Test", "category": "Guide Informatif", "date": "2025-10-26"},
    "approved": true
  }'
```

### View Example Article

```
http://localhost:3001/article/exemple-test
```

## Next Steps

### Immediate (Required)
1. [ ] Set environment variables in Vercel dashboard
2. [ ] Share Google Sheet with service account
3. [ ] Test webhook with curl
4. [ ] Test with N8N workflow

### Short Term
1. [ ] Populate Google Sheet with existing articles
2. [ ] Test article publication flow end-to-end
3. [ ] Verify GitHub commits work
4. [ ] Verify article appears on live site

### Future Enhancements
- [ ] Automatic image upload to Vercel Blob storage
- [ ] Article scheduling (publish at specific date/time)
- [ ] Draft status tracking
- [ ] Webhook signature validation (HMAC)
- [ ] Preview endpoint before publication
- [ ] Automated SEO metadata generation
- [ ] Image optimization and resizing

## File Structure

```
project-root/
├── src/
│   ├── components/
│   │   ├── ArticleRenderer.jsx          (NEW - Markdown renderer)
│   │   ├── ArticleExempleTest.jsx       (NEW - Test article)
│   │   └── ... (other components)
│   ├── content/
│   │   └── articles/
│   │       ├── exemple-article-test.md  (NEW - Example)
│   │       ├── README.md                (NEW - Guide)
│   │       ├── WORKFLOW.md              (NEW - Workflow)
│   │       └── template-article.md      (NEW - Template)
│   ├── main.jsx                         (MODIFIED - Added ArticleExempleTest route)
│   └── ... (other files)
├── api/
│   ├── n8n-webhook.js                   (NEW - Main webhook handler)
│   ├── lib/
│   │   ├── github.js                    (NEW - GitHub utils)
│   │   └── sheets.js                    (NEW - Sheets utils)
│   └── WEBHOOK_README.md                (NEW - API docs)
├── .env.example                         (MODIFIED - Added webhook vars)
├── BACKEND_SETUP_GUIDE.md               (NEW - Setup walkthrough)
├── N8N_INTEGRATION_SUMMARY.md           (NEW - This file)
├── vercel.json                          (Already configured)
└── ... (other files)
```

## Quick Reference

| Task | Location |
|------|----------|
| Write article | Send to webhook with `approved: false` |
| Publish article | Send to webhook with `approved: true` |
| View webhook docs | `/api/WEBHOOK_README.md` |
| Setup instructions | `/BACKEND_SETUP_GUIDE.md` |
| Article format | `/src/content/articles/template-article.md` |
| Article rendering | `/src/components/ArticleRenderer.jsx` |
| Test article | Visit `/article/exemple-test` |
| Webhook endpoint | POST `/api/n8n-webhook` |
| Google Sheet | [Link](https://docs.google.com/spreadsheets/d/13V4v7C3pECzAUaeSN7o3YxSBoY_JD2z23M_--xPP1fw/) |

## Security Notes

- GitHub tokens are stored only in Vercel, never in git
- Google Sheets API key is environment-only
- Service account has editor permission only on designated sheet
- Telegram bot token is environment-only
- Consider adding webhook signature validation for production
- Monitor Vercel function logs for suspicious activity

## Support & Debugging

1. **Check webhook logs**: Vercel Dashboard → Deployments → Functions → n8n-webhook → Logs
2. **Test endpoint**: Use curl command to test webhook directly
3. **Check git commits**: `git log | grep "Add article"`
4. **Verify files exist**: Check `/src/content/articles/` and `/src/components/`
5. **Build locally**: `npm run build` to catch errors before deployment

## Deployment Checklist

Before going live with N8N automation:

- [ ] All environment variables set in Vercel
- [ ] GitHub token has correct permissions
- [ ] Google Sheet is shared with service account
- [ ] Telegram bot token configured (if using notifications)
- [ ] Webhook tested with curl
- [ ] Example article displays correctly
- [ ] N8N workflow configured with HTTP node
- [ ] Test article published and verified on live site
- [ ] Google Sheet updated with published article
- [ ] GitHub commit created for test article

## Contact & Troubleshooting

Refer to:
- **API Details**: `/api/WEBHOOK_README.md`
- **Setup Help**: `/BACKEND_SETUP_GUIDE.md`
- **Article Format**: `/src/content/articles/README.md`
- **Workflow Docs**: `/src/content/articles/WORKFLOW.md`
