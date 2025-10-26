# Articles - Content Directory

Ce dossier contient tous les articles Markdown générés par ProjectBot (agent N8N).

## Structure

Chaque article est un fichier `.md` avec la structure suivante :

```markdown
---
id: "article-slug"
title: "Titre de l'article"
category: "Guide Informatif"
categoryColor: "#72B0CC"
date: "2025-10-26"
tags: ["Tag1", "Tag2", "Tag3"]
seoKeywords: ["mot-clé 1", "mot-clé 2", "mot-clé 3"]
author: "ProjectBot"
imageHero: "/images/article-slug.png"
imageSources: []
---

# Titre de l'article

Contenu en Markdown...
```

## Frontmatter - Champs obligatoires

| Champ | Type | Description |
|-------|------|-------------|
| `id` | string | Slug unique (kebab-case) |
| `title` | string | Titre complet de l'article |
| `category` | string | Guide Informatif / Guide Pratique / Success Story / Analyse |
| `categoryColor` | string | Code couleur hex (#72B0CC, #CF6E3F, #82BC6C) |
| `date` | string | Date au format YYYY-MM-DD |
| `tags` | array | 3 tags descriptifs maximum |
| `seoKeywords` | array | Mots-clés pour SEO (3-5) |
| `author` | string | ProjectBot ou autre |
| `imageHero` | string | Chemin de l'image hero (1920x1080) |
| `imageSources` | array | Images supplémentaires (sections) |

## Exemple d'article complet

Voir `template-article.md` pour un exemple détaillé avec tous les formats supportés.

## Flux de publication

1. **Génération** : ProjectBot rédige article + prompts images
2. **Validation** : Adelin valide via Telegram
3. **Sauvegarde** : Backend crée le fichier `.md`
4. **Indexation** : Google Sheet mis à jour automatiquement
5. **Composant React** : ArticleXYZ.jsx généré automatiquement
6. **Routing** : Route ajoutée dans main.jsx
7. **Git** : Commit + Push

## Conventions

- Fichiers en **kebab-case** : `article-xyz.md`
- Slugs en **kebab-case** : `article-xyz`
- Markdown standard avec sections `##` et `###`
- Images : format `.png` (1920x1080 minimum)
- Contenu : 800-1500 mots recommandés
