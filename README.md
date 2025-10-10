# Projectview Website

Site web officiel de Projectview - La technologie au service de l'émotion.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install
```

### Développement

```bash
# Lancer le serveur de développement
npm run dev
```

Le site sera accessible à l'adresse `http://localhost:3000`

### Build

```bash
# Créer une version de production
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

### Prévisualisation

```bash
# Prévisualiser la version de production
npm run preview
```

## 📦 Déploiement

### Déploiement sur Vercel (Recommandé)

1. **Installation de Vercel CLI** (si nécessaire)
   ```bash
   npm install -g vercel
   ```

2. **Premier déploiement**
   ```bash
   # Se connecter à Vercel
   vercel login

   # Déployer le projet
   vercel
   ```

3. **Déploiement en production**
   ```bash
   npm run deploy
   # ou
   vercel --prod
   ```

### Déploiement sur Netlify

1. **Avec Netlify CLI**
   ```bash
   # Installer Netlify CLI
   npm install -g netlify-cli

   # Se connecter
   netlify login

   # Déployer
   netlify deploy --prod
   ```

2. **Via l'interface Netlify**
   - Connectez votre repository GitHub/GitLab
   - Build command: `npm run build`
   - Publish directory: `dist`

### Déploiement sur GitHub Pages

```bash
# Installer gh-pages
npm install -g gh-pages

# Ajouter dans package.json:
# "homepage": "https://votre-username.github.io/projectview-site",
# "deploy": "npm run build && gh-pages -d dist"

# Déployer
npm run deploy
```

## 🛠️ Technologies utilisées

- **React 18** - Bibliothèque UI
- **Vite** - Build tool rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes modernes
- **PostCSS** - Transformation CSS

## 📁 Structure du projet

```
projectview-site/
├── public/              # Fichiers statiques
├── src/
│   ├── assets/          # Images, vidéos, etc.
│   ├── components/      # Composants React
│   │   └── ProjectviewWebsite.jsx
│   ├── index.css        # Styles globaux + Tailwind
│   └── main.jsx         # Point d'entrée
├── index.html           # Template HTML
├── package.json         # Dépendances
├── tailwind.config.js   # Configuration Tailwind
├── vite.config.js       # Configuration Vite
└── README.md
```

## 🎨 Personnalisation

### Couleurs

Les couleurs principales sont définies dans `tailwind.config.js`:
- **Bleu Projectview**: `#72B0CC`
- **Orange Projectview**: `#CF6E3F`
- **Vert Projectview**: `#82BC6C`

### Contenu

Le contenu principal se trouve dans `/src/components/ProjectviewWebsite.jsx`

### Vidéos

Pour ajouter vos vidéos:
1. Placez vos fichiers vidéo dans `/public/videos/`
2. Mettez à jour les URLs dans le composant:
   - `beforeVideo: "/videos/votre-video-avant.mp4"`
   - `afterVideo: "/videos/votre-video-apres.mp4"`

## 🔧 Configuration du domaine personnalisé

### Sur Vercel

1. Allez dans Project Settings → Domains
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions

### Sur Netlify

1. Site settings → Domain management
2. Add custom domain
3. Configurez les DNS selon les instructions

## 📱 Optimisation

Le site est déjà optimisé pour:
- ✅ Performance (Vite build optimisé)
- ✅ SEO (meta tags, semantic HTML)
- ✅ Responsive design (mobile-first)
- ✅ Accessibilité (ARIA labels)
- ✅ Lazy loading (images et vidéos)

## 🐛 Support

Pour toute question ou problème:
- Email: contact@projectview.fr
- GitHub Issues: [lien vers votre repo]

## 📄 Licence

© 2025 Projectview. Tous droits réservés.
