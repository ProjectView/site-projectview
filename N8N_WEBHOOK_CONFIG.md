# N8N Webhook Configuration Guide

This guide shows how to configure your N8N ProjectBot workflow to send articles to the Netlify webhook for automatic publication.

## Webhook Details

- **URL**: `https://projectview.fr/.netlify/functions/n8n-webhook`
- **Method**: POST
- **Content-Type**: application/json
- **Status**: ✅ Live and tested

## N8N HTTP Request Node Setup

### Step 1: Add HTTP Request Node

1. In your N8N workflow, add an **HTTP Request** node
2. Name it something like "Send to ProjectView Webhook"

### Step 2: Configure HTTP Request

**URL**:
```
https://projectview.fr/.netlify/functions/n8n-webhook
```

**Method**:
```
POST
```

**Headers**:
```
Content-Type: application/json
```

### Step 3: Configure Request Body

Set the body to **Raw JSON** format and use this structure:

```json
{
  "articleMarkdown": "{{ $node.ArticleWriter.json.fullMarkdown }}",
  "frontmatter": {{ $node.ArticleWriter.json.frontmatter }},
  "nanobananaPrompts": {{ $node.ArticleWriter.json.prompts }},
  "approved": {{ $node.ApprovalNode.json.approved }}
}
```

**Variable references** (replace with your actual node names):
- `ArticleWriter.json.fullMarkdown` - The complete Markdown with YAML frontmatter
- `ArticleWriter.json.frontmatter` - Object with {id, title, category, date, tags, author, etc.}
- `ArticleWriter.json.prompts` - Array of image generation prompts
- `ApprovalNode.json.approved` - Boolean (true = publish, false = draft)

### Step 4: Handle Webhook Responses

The webhook returns different responses based on the `approved` status:

**Draft (approved: false)**:
```json
{
  "status": "pending_approval",
  "message": "Article sauvegardé en brouillon. En attente d'approbation d'Adelin avant publication.",
  "article": {
    "id": "article-slug",
    "title": "Article Title"
  }
}
```

**Published (approved: true)**:
```json
{
  "status": "success",
  "message": "Article publié avec succès",
  "article": {
    "id": "article-slug",
    "title": "Article Title",
    "url": "https://projectview.fr/article/article-slug"
  },
  "integrations": {
    "github": "success",
    "sheets": "skipped",
    "telegram": "skipped"
  }
}
```

**Error** (400/500):
```json
{
  "status": "error",
  "message": "Error message",
  "details": "Detailed error information"
}
```

## Example N8N JSON Node Config

If you want to use a **JSON node** to construct the payload:

```json
{
  "articleMarkdown": "{{ $node.ArticleWriter.json.fullMarkdown }}",
  "frontmatter": {
    "id": "{{ $node.ArticleWriter.json.slug }}",
    "title": "{{ $node.ArticleWriter.json.title }}",
    "category": "{{ $node.ArticleWriter.json.category }}",
    "date": "{{ $now.format('yyyy-MM-dd') }}",
    "tags": "{{ $node.ArticleWriter.json.tags }}",
    "author": "ProjectBot"
  },
  "nanobananaPrompts": "{{ $node.ImageGenerator.json.prompts }}",
  "approved": "{{ $node.ApprovalNode.json.approved }}"
}
```

## Article ID Requirements

The `frontmatter.id` field must follow these rules:

- ✅ **Correct**: `ecrans-collaboratifs`, `guide-vr-presentation`, `case-study-2025`
- ❌ **Invalid**: `Écrans Collaboratifs` (capitals), `ecrans_collaboratifs` (underscores), `ecrans collaboratifs` (spaces)

## Frontend Integration

### What Happens When Article is Published

1. **Webhook receives POST** → Validates data
2. **Creates 3 files in GitHub**:
   - `src/content/articles/{id}.md` - Markdown file with YAML frontmatter
   - `src/components/{ComponentName}.jsx` - React wrapper component
   - Updates `src/main.jsx` - Adds import and route
3. **GitHub auto-triggers Netlify rebuild**
4. **Netlify deploys** → Article live in ~45 seconds
5. **Live URL**: `https://projectview.fr/article/{id}`

## Testing Workflow

### Test 1: Draft Article

```json
{
  "articleMarkdown": "---\nid: \"test-draft-n8n\"\ntitle: \"Draft Test from N8N\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\", \"n8n\"]\nauthor: \"ProjectBot\"\n---\n\n# Test Article\n\nThis is a test.",
  "frontmatter": {
    "id": "test-draft-n8n",
    "title": "Draft Test from N8N",
    "category": "Guide Informatif",
    "date": "2025-10-26",
    "tags": ["test", "n8n"],
    "author": "ProjectBot"
  },
  "approved": false
}
```

**Expected**: HTTP 200 with `"status": "pending_approval"`

### Test 2: Published Article

```json
{
  "articleMarkdown": "---\nid: \"test-published-n8n\"\ntitle: \"Published Test from N8N\"\ncategory: \"Guide Informatif\"\ndate: \"2025-10-26\"\ntags: [\"test\", \"n8n\"]\nauthor: \"ProjectBot\"\n---\n\n# Published Test\n\nThis article was published!",
  "frontmatter": {
    "id": "test-published-n8n",
    "title": "Published Test from N8N",
    "category": "Guide Informatif",
    "date": "2025-10-26",
    "tags": ["test", "n8n"],
    "author": "ProjectBot"
  },
  "approved": true
}
```

**Expected**: HTTP 201 with `"status": "success"` + URL to live article

---

## Required Fields in Frontmatter

At minimum, the webhook requires:

```json
{
  "id": "string (kebab-case, required)",
  "title": "string (required)",
  "category": "string (required)",
  "date": "YYYY-MM-DD (required)",
  "tags": ["array", "of", "tags"],
  "author": "ProjectBot (required)"
}
```

Optional but recommended:
```json
{
  "seoKeywords": ["keyword1", "keyword2"],
  "description": "Short summary",
  "imageHero": "/images/article-slug-hero.png"
}
```

## Error Handling

Common errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| `Bad control character in string literal in JSON` | Malformed JSON (newlines in wrong places) | Use N8N's JSON node, not manual strings |
| `"sha" wasn't supplied` | Trying to update existing file without SHA | Webhook handles this - your data is fine |
| `Invalid request` | Missing required fields in frontmatter | Check `id`, `title`, `category`, `date` |
| `ID must be kebab-case` | Article ID has capitals, underscores, or spaces | Use `guide-presentation-innovante` format |
| `GitHub API error` | GitHub token not set or invalid | Check GITHUB_TOKEN in Netlify environment variables |

## Monitoring

### Check Published Articles

Visit: `https://projectview.fr/article/{id}`

### Check GitHub Commits

Visit: https://github.com/ProjectView/site-projectview/commits/main

Filter for commits with "Add article:" prefix to see webhook publications.

### Check Netlify Builds

Visit: https://app.netlify.com/sites/site-projectview/deploys

Look for builds triggered by "GitHub" to see auto-deployments after webhook commits.

## Success Checklist

After configuring N8N:

- [ ] HTTP Request node added to workflow
- [ ] URL set to `https://projectview.fr/.netlify/functions/n8n-webhook`
- [ ] Method is POST
- [ ] Content-Type header set to application/json
- [ ] Request body uses correct JSON structure
- [ ] All required frontmatter fields mapped
- [ ] Test with draft article (approved: false)
- [ ] Receive "pending_approval" response
- [ ] Test with published article (approved: true)
- [ ] Article appears live at correct URL
- [ ] GitHub commit created for published article
- [ ] Netlify auto-deployed

## Support

If webhook isn't working:

1. **Test curl command**:
   ```bash
   curl -X POST https://projectview.fr/.netlify/functions/n8n-webhook \
     -H "Content-Type: application/json" \
     -d '{"articleMarkdown":"...","frontmatter":{...},"approved":true}'
   ```

2. **Check Netlify logs**: https://app.netlify.com/sites/site-projectview

3. **Verify JSON format** using a JSON validator

4. **Check required fields**: id, title, category, date (at minimum)

5. **Test article ID**: Must be kebab-case with no special characters

---

**Status**: ✅ Webhook is live and working. Ready for N8N integration!
