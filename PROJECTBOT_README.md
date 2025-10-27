# 🤖 ProjectBot - Automatisation d'Articles pour ProjectView

**Transforme tes idées en articles publiés en 3 clics** 📝✨

ProjectBot est un système complètement automatisé qui:
- Propose des idées d'articles via Telegram
- Rédige des articles optimisés (Markdown ou JSX riche)
- Les publie directement sur projectview.fr
- Crée automatiquement les fichiers GitHub
- Déploie sur Netlify en 2 minutes

---

## 🚀 Installation rapide (5 min)

### 1. Clone/pull les dernières modifications

```bash
git pull origin main
```

### 2. Lance le setup automatique

**Linux/Mac:**
```bash
bash setup-projectbot.sh
```

**Windows (PowerShell):**
```bash
python setup-netlify-env.py
```

Tu vas devoir entrer:
- Token GitHub (avec permission "repo")
- Propriétaire du repo (ProjectView)
- Nom du repo (site-projectview)
- Optionnel: Google Sheets, Telegram

### 3. Importe le workflow N8N

- Ouvre N8N
- Importe: `N8N_WORKFLOW_UPDATED.json`
- Remplace les anciens nodes par les nouveaux

### 4. Push et déploie

```bash
git add .
git commit -m "Setup ProjectBot automation"
git push origin main
```

Netlify va automatiquement redéployer! ✨

---

## 📱 Utilisation

### Flux utilisateur

```
Toi (Telegram)
    "l'article 2"
    ↓
ProjectBot
    "Quelle version? 1️⃣ Simple 2️⃣ Riche"
    ↓
Toi: "2"
    ↓
Rédacteur JSX (IA)
    [Génère un article avec stats, encarts, composants]
    ↓
ProjectBot
    "Veux-tu publier?"
    ↓
Toi: "oui"
    ↓
Netlify Webhook
    [Crée le fichier]
    [Update main.jsx si JSX]
    [Git commit + push]
    ↓
GitHub
    ✅ Article créé
    ↓
Vercel Deploy
    🚀 Live sur projectview.fr!
```

### Exemple réel

```
Adelin: "salut"

ProjectBot: "Salut! 📚 Voici 3 idées d'articles:"
  1️⃣ "L'IA dans les salles de réunion - Transformer vos meetings"
  2️⃣ "Écrans 8K pour retail - Impact sur les clients"
  3️⃣ "VR immersive en formation - Résultats mesurés"

Adelin: "le 2"

ProjectBot: "J'envoie ça à mon équipe de rédaction, donne-moi une minute..."
  [Rédacteur génère l'article]

ProjectBot: "Article prêt! Quelle version préfères-tu?
  1️⃣ Simple (markdown basique) - Rapide
  2️⃣ Riche (JSX avec stats, encarts) - Plus beau"

Adelin: "2"

ProjectBot: "✨ Article prêt! Veux-tu le publier? (oui/non)"

Adelin: "oui"

ProjectBot: "✅ Article publié!
  Accès: https://projectview.fr/article/ecrans-8k-retail"
```

---

## 🎨 Deux formats d'articles

### 1. Markdown simple (80% des articles)

✅ **Avantages:**
- Rapide à générer
- Léger
- Facile à maintenir
- Chargement rapide

❌ **Inconvénients:**
- Design basique
- Pas de stats/encarts colorés

**Exemple:**
```markdown
---
id: "mon-article"
title: "Titre"
category: "Guide Informatif"
date: "2025-10-28"
tags: ["tag1", "tag2"]
author: "ProjectBot"
---

# Mon Article

Contenu en markdown normal.
```

**Rendu:** http://localhost:3001/article/mon-article

---

### 2. JSX riche (20% des articles phares)

✅ **Avantages:**
- Design premium
- Stats, encarts colorés
- Composants interactifs
- Beaucoup plus beau

❌ **Inconvénients:**
- Plus lourd
- Génération plus complexe
- Update manual de main.jsx

**Exemple:**
```jsx
import React from 'react';
import { NumberedCard, StatsGrid, StatCard } from './ArticleComponents';

const ArticleMonArticle = () => {
  const metadata = {
    id: "mon-article",
    title: "Titre",
    category: "Guide Informatif",
    date: "2025-10-28",
    author: "ProjectBot"
  };

  return (
    <div>
      {/* Hero section */}
      {/* Contenu avec composants */}
      <NumberedCard number="1" title="Point 1" color="blue">
        {/* Contenu */}
      </NumberedCard>

      <StatsGrid>
        <StatCard label="Stat 1" value="+45%" />
      </StatsGrid>
    </div>
  );
};
```

**Rendu:** http://localhost:3001/article/mon-article (auto-routé)

---

## 🛠️ Architecture

### Frontend (React + Vite)

```
src/
├─ components/
│  ├─ ArticleRenderer.jsx       (Charge les articles markdown)
│  ├─ ArticleComponents.jsx     (Composants réutilisables)
│  ├─ Article*.jsx              (Articles JSX statiques)
│  └─ ...
├─ content/
│  └─ articles/
│     ├─ article-1.md
│     ├─ article-2.md
│     └─ ...
└─ main.jsx                     (Routes)
```

### Backend (Netlify Functions)

```
netlify/
└─ functions/
   └─ n8n-webhook.js            (Webhook qui reçoit les articles)
      ├─ Parse markdown/JSX
      ├─ Crée fichiers via GitHub API
      ├─ Update main.jsx
      ├─ Update Google Sheets
      └─ Envoie notifications Telegram
```

### Automation (N8N)

```
N8N Workflow:
  Telegram Trigger
      ↓
  ProjectBot (Agent avec GPT-4)
      ├─ Rédacteur en Chef - Markdown (Claude)
      ├─ Rédacteur JSX (Claude)
      └─ Discussion Tool (Telegram)
      ↓
  HTTP Request → Netlify Webhook
```

---

## 📊 Intégrations supportées

| Service | Status | Notes |
|---------|--------|-------|
| **GitHub** | ✅ Obligatoire | Crée/modifie les fichiers |
| **Netlify** | ✅ Obligatoire | Déploie automatiquement |
| **Google Sheets** | ⚠️ Optionnel | Track les articles publiés |
| **Telegram** | ⚠️ Optionnel | Notifications |
| **Slack** | 🔄 À venir | Notifications alternatives |
| **Discord** | 🔄 À venir | Notifications alternatives |

---

## 🔧 Commandes utiles

### Netlify CLI

```bash
# Voir l'état
netlify status

# Lister les variables d'environnement
netlify env:list

# Définir une variable
netlify env:set GITHUB_TOKEN "ton-token"

# Voir les logs de la fonction
netlify functions:invoke n8n-webhook

# Tester un déploiement
netlify deploy --dry-run

# Redéployer
netlify deploy --prod
```

### Git

```bash
# Pull les dernières modifs
git pull origin main

# Voir le statut
git status

# Voir les changements
git diff

# Commit et push
git add .
git commit -m "message"
git push origin main
```

---

## 🐛 Troubleshooting

### Erreur: "Article not found"

→ L'article markdown n'a pas été copié dans `public/content/articles/`
→ Solution: `cp src/content/articles/*.md public/content/articles/`

### Erreur: "GITHUB_TOKEN not set"

→ Variable d'environnement manquante sur Netlify
→ Solution: `netlify env:set GITHUB_TOKEN "ton-token"`

### Erreur: "Could not fetch main.jsx"

→ Token GitHub n'a pas les permissions
→ Solution: Crée un nouveau token avec permission "repo"

### Article en brouillon?

→ Tu as répondu "non" à la question "publier?"
→ L'article est en attente d'approbation
→ Le webhook le sauvegarde mais ne le publie pas

---

## 📚 Documentation

- **Setup complet:** `SETUP_PROJECTBOT.md`
- **Workflow N8N:** `N8N_WORKFLOW_UPDATED.json`
- **Webhook Netlify:** `netlify/functions/n8n-webhook.js`
- **Composants:** `src/components/ArticleComponents.jsx`

---

## 💡 Exemples d'utilisation

### Cas 1: Article simple marketing

```
Adelin: "propose des idées"

ProjectBot propose 3 idées

Adelin: "le 1"
ProjectBot: "Version 1 ou 2?"
Adelin: "1" (simple)
ProjectBot: "Publier?"
Adelin: "oui"

✅ Article markdown créé en 30 secondes
```

### Cas 2: Article premium avec stats

```
Adelin: "l'article 3"

ProjectBot propose des idées

Adelin: "le 3"
ProjectBot: "Version 1 ou 2?"
Adelin: "2" (riche avec JSX)
[IA génère un composant React complet avec stats]
ProjectBot: "Publier?"
Adelin: "oui"

✅ Article JSX créé avec route auto-update main.jsx
🚀 Déploiement Netlify automatique
✨ Live en 2 minutes!
```

---

## 🎯 Roadmap

- [x] Markdown simple
- [x] JSX riche avec composants
- [x] GitHub integration
- [x] Netlify functions
- [x] N8N workflow
- [ ] Slack notifications
- [ ] Discord webhooks
- [ ] SEO automatique
- [ ] Social media posting
- [ ] Analytics tracking
- [ ] A/B testing

---

## 📞 Support

Besoin d'aide?

1. Lis `SETUP_PROJECTBOT.md`
2. Vérifie `netlify status`
3. Regarde les logs: `netlify functions:invoke n8n-webhook`
4. Check `netlify env:list`

---

**Créé avec ❤️ pour automatiser la création de contenu**

*ProjectBot © 2025*
