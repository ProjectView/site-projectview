# Workflow de génération et publication d'articles

Ce document décrit le workflow complet de génération d'articles via ProjectBot.

## 🔄 Flux global

```
┌─────────────────────────────────────────────────────────────┐
│            LUNDI 9H - PROPOSITIONS                           │
├─────────────────────────────────────────────────────────────┤
│ 1. ProjectBot lit Google Sheet (articles existants)          │
│ 2. Génère 3 idées d'articles ORIGINALES                     │
│ 3. Envoie propositions via Telegram                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│            ADELIN RÉPOND AVEC UN CHOIX                       │
├─────────────────────────────────────────────────────────────┤
│ Adelin: "Le 2 est bien" ou "Rédige le 1"                   │
│ ProjectBot comprend la référence grâce à la mémoire         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│            RÉDACTION DE L'ARTICLE                            │
├─────────────────────────────────────────────────────────────┤
│ 1. ProjectBot rédige article complet (800-1500 mots)       │
│ 2. Formate en Markdown avec frontmatter YAML                │
│ 3. Génère 3 prompts Nano Banana pour images                │
│ 4. Envoie article via Telegram (splitté en msgs)           │
│ 5. Envoie prompts images                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│            CONFIRMATION AVANT PUBLICATION                    │
├─────────────────────────────────────────────────────────────┤
│ ProjectBot: "Souhaites-tu publier ? (oui/non)"             │
│ Adelin: "oui" ou "non"                                      │
│ Si "non" → Enregistre comme brouillon                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│            SAUVEGARDE & PUBLICATION                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Backend reçoit webhook POST                              │
│ 2. Crée /src/content/articles/article-slug.md               │
│ 3. Met à jour Google Sheet (article ajouté)                │
│ 4. Génère ArticleSlug.jsx (wrapper React)                   │
│ 5. Ajoute route dans main.jsx                               │
│ 6. Commit + Push GitHub                                     │
│ 7. Notifie Adelin: "✅ Article live!"                       │
└─────────────────────────────────────────────────────────────┘
```

## 📝 Format de l'article généré

### Format Markdown avec frontmatter YAML

```markdown
---
id: "article-slug"
title: "Titre complet de l'article"
category: "Guide Informatif"
categoryColor: "#72B0CC"
date: "2025-10-26"
tags: ["Tag1", "Tag2", "Tag3"]
seoKeywords: ["mot-clé 1", "mot-clé 2"]
author: "ProjectBot"
imageHero: "/images/article-slug.png"
imageSources: [
  { section: "section_1", url: "/images/article-slug-section1.png" }
]
---

# Titre de l'article

Contenu Markdown standard...
```

### Points clés du format

- **Frontmatter YAML** : Métadonnées entre `---` et `---`
- **Markdown standard** : Titres (##, ###), listes, citations
- **Pas de composants React** : Juste du Markdown pur
- **Images référencées** : URLs complètes `/images/...`

## 🖼️ Génération des images

### 3 prompts Nano Banana par article

1. **Hero** : Image principale (1920x1080)
2. **Section 1** : Image pour une section importante (1920x1080)
3. **Section 2** : Infographie ou détail (1920x1080)

### Format des prompts

```json
{
  "prompts": [
    {
      "name": "Hero - Introduction article",
      "position": "hero",
      "prompt": "...",
      "negative_prompt": "...",
      "height": 1080,
      "width": 1920,
      "steps": 45,
      "guidance_scale": 8,
      "seed": null
    },
    ...
  ]
}
```

**Actions après réception :**
1. Adelin copie les prompts
2. Va sur Nano Banana
3. Génère les images
4. Sauvegarde dans `/public/images/article-slug*.png`
5. N8N crée les webhooks pour sauvegarder l'article avec les URLs images

## 🔗 Intégration avec le site

### Automatisation côté backend

```javascript
// POST /api/n8n-webhook/save-article
{
  "articleMarkdown": "...",  // Contenu complet en Markdown
  "frontmatter": { ... },    // Métadonnées
  "nanobananaPrompts": [ ... ]  // 3 prompts
}
```

**Backend fait automatiquement :**

1. ✅ Crée `/src/content/articles/article-slug.md`
2. ✅ Génère `/src/components/ArticleSlug.jsx` (wrapper React)
3. ✅ Ajoute route dans `/src/main.jsx`
4. ✅ Met à jour `/src/data/articles-registry.json` (ou Google Sheet)
5. ✅ Commit + Push GitHub
6. ✅ Notifie Telegram avec lien site

### Wrapper React généré automatiquement

```javascript
// ArticleSlug.jsx (généré automatiquement)
import React from 'react';
import ArticleRenderer from '@/components/ArticleRenderer';
import articleContent from '@/content/articles/article-slug.md?raw';

export default function ArticleSlug() {
  return <ArticleRenderer markdown={articleContent} />;
}
```

### Composant ArticleRenderer

Ce composant :
- Lit le Markdown
- Parse le frontmatter YAML
- Rend le contenu avec styles
- Insère les images aux bons endroits
- Ajoute navigation, footer, chatbot

## ⚙️ Configuration N8N requise

### Prompt amélioré pour ProjectBot

```
Tu es ProjectBot, expert en génération de contenu pour Projectview.

CONTEXTE ACTUEL:
{articles du Google Sheet}

RÈGLES:
1. Ne jamais proposer article sur sujet déjà couvert
2. Générer 3 idées ORIGINALES et COMPLÉMENTAIRES
3. Rédiger en Markdown avec frontmatter YAML
4. Générer exactement 3 prompts Nano Banana (hero + 2 sections)
5. Format réponse:

---ARTICLE---
[Markdown complet]
---ARTICLE---

---PROMPTS---
[JSON des prompts]
---PROMPTS---
```

### Webhooks N8N à configurer

1. **Webhook de réception** : `/webhook/n8n/save-article`
2. **Webhook de callback** : Pour notifier Telegram du succès

## 📊 Google Sheet - Colonnes recommandées

```
A: ID (slug unique)
B: Titre
C: Date publication
D: Catégorie
E: Tags (séparés par |)
F: Topics principaux
G: Mots-clés SEO
H: Status (draft/published)
I: URL site
J: Prompts images (JSON)
K: Notes
```

## ✅ Checklist avant publication

- [ ] Titre pertinent et SEO-friendly
- [ ] 800+ mots
- [ ] Image hero générée (1920x1080)
- [ ] 2-3 images supplémentaires pour sections
- [ ] Pas de sujet dupliqué dans Google Sheet
- [ ] Tags cohérents (max 3)
- [ ] Mots-clés SEO (3-5)
- [ ] Pas de liens cassés
- [ ] Markdown formaté correctement
- [ ] Approuvé par Adelin via Telegram

## 🚀 Prochaines étapes

1. ✅ Créer dossier `/src/content/articles/`
2. ⏳ Créer composant `ArticleRenderer.jsx`
3. ⏳ Backend Node.js `/api/n8n-webhook/save-article`
4. ⏳ Intégration Google Sheets API
5. ⏳ Intégration GitHub API
6. ⏳ Mise à jour prompt N8N avec context Google Sheet
