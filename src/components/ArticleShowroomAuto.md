# Guide d'implémentation des photos - Article Showroom Automobile

## 📸 Slots photo à remplir

### 1. **Photo Hero (ligne 50)**
- **Emplacement** : Juste après le header, grande image panoramique
- **Dimensions recommandées** : 1920x1080px (16:9)
- **Contenu suggéré** : Vue d'ensemble du showroom transformé avec les tables tactiles visibles, éclairage moderne, ambiance premium
- **Angle** : Vue large qui montre l'espace, les installations et l'atmosphère
- **Fichier à utiliser** : `/public/images/articles/showroom-auto-hero.jpg`

### 2. **Photo "Avant" (ligne 125)**
- **Emplacement** : Section contexte, pour illustrer la situation initiale
- **Dimensions recommandées** : 1200x675px (16:9)
- **Contenu suggéré** : Showroom traditionnel avec brochures papier sur comptoir, décoration datée, ambiance statique
- **Détails à capturer** :
  - Piles de catalogues papier
  - Clients qui attendent ou regardent leur téléphone
  - Absence d'interaction
- **Fichier à utiliser** : `/public/images/articles/showroom-auto-avant.jpg`

### 3. **Photos Installation (ligne 215)**
Deux photos côte à côte :

#### Photo A : Table tactile en action
- **Dimensions recommandées** : 800x800px (1:1)
- **Contenu suggéré** :
  - Client interagissant avec la table tactile
  - Gros plan sur l'interface de configuration
  - Reflet des couleurs de voiture à l'écran sur le visage du client (engagement)
- **Fichier à utiliser** : `/public/images/articles/showroom-auto-table-tactile.jpg`

#### Photo B : Mur LED
- **Dimensions recommandées** : 800x800px (1:1)
- **Contenu suggéré** :
  - Le mur LED de 3x2m avec contenu dynamique affiché
  - Vue depuis l'entrée du showroom
  - Clients qui regardent l'écran
- **Fichier à utiliser** : `/public/images/articles/showroom-auto-mur-led.jpg`

### 4. **Photo Résultats / Clients satisfaits (ligne 335)**
- **Emplacement** : Section résultats, pour montrer l'impact concret
- **Dimensions recommandées** : 1200x675px (16:9)
- **Contenu suggéré** :
  - Groupe de clients (famille ou couple) souriants autour d'une table tactile
  - Vendeur en discussion avec clients dans l'arrière-plan
  - Ambiance chaleureuse et moderne
  - Visages heureux et engagés
- **Fichier à utiliser** : `/public/images/articles/showroom-auto-clients-satisfaits.jpg`

## 🎨 Spécifications techniques

### Format des images
- **Format** : JPG optimisé (compression 85%)
- **Poids max** : 500KB par image pour optimiser le temps de chargement
- **Responsive** : Prévoir des versions @2x pour les écrans Retina

### Optimisation
```bash
# Commande pour optimiser les images (avec ImageMagick)
convert input.jpg -quality 85 -resize 1920x1080 output.jpg
```

### Placement dans le projet
```
public/
  └── images/
      └── articles/
          ├── showroom-auto-hero.jpg
          ├── showroom-auto-avant.jpg
          ├── showroom-auto-table-tactile.jpg
          ├── showroom-auto-mur-led.jpg
          └── showroom-auto-clients-satisfaits.jpg
```

## 🔧 Comment remplacer les slots

### Étape 1 : Placer les images
Copiez vos images dans `/public/images/articles/`

### Étape 2 : Modifier le composant
Dans `ArticleShowroomAuto.jsx`, remplacez les divs de placeholder par des images :

**Exemple pour la photo hero (ligne ~50) :**

Remplacer :
```jsx
<div className="aspect-video bg-gradient-to-br from-[#72B0CC] to-[#82BC6C] flex items-center justify-center">
  {/* Placeholder */}
</div>
```

Par :
```jsx
<img
  src="/images/articles/showroom-auto-hero.jpg"
  alt="Showroom automobile transformé avec tables tactiles Projectview"
  className="w-full h-full object-cover"
  loading="lazy"
/>
```

### Étape 3 : Optimiser le SEO
N'oubliez pas d'ajouter des attributs `alt` descriptifs pour le SEO :
- "Showroom automobile moderne avec tables tactiles interactives"
- "Ancien showroom automobile avec brochures papier"
- "Client configurant sa voiture sur table tactile Projectview"
- "Mur LED d'affichage dynamique dans showroom automobile"
- "Clients satisfaits utilisant la solution Projectview"

## 💡 Conseils photo

### Éclairage
- Privilégier la lumière naturelle ou un éclairage LED moderne
- Éviter les zones surexposées ou trop sombres
- Cohérence de température de couleur entre toutes les photos

### Composition
- Règle des tiers pour les photos de showroom
- Montrer les produits ET les personnes (humaniser)
- Cadrage propre, pas d'éléments parasites

### Authenticité
- Utiliser de vrais clients (avec leur accord) plutôt que des acteurs
- Montrer de vraies interactions, pas de poses forcées
- Capturer des émotions authentiques (surprise, joie, concentration)

## 🎬 Alternative : Vidéos

Pour un impact encore plus fort, vous pouvez remplacer certaines images par des vidéos courtes :

```jsx
<video
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-full object-cover"
>
  <source src="/videos/articles/showroom-auto-hero.mp4" type="video/mp4" />
</video>
```

**Recommandations vidéo :**
- Durée : 10-15 secondes en boucle
- Format : MP4 H.264
- Résolution : 1920x1080
- Poids : Max 5MB
- Toujours avec fallback image

## ✅ Checklist avant publication

- [ ] Toutes les images sont optimisées (< 500KB)
- [ ] Les attributs `alt` sont renseignés
- [ ] Les images sont dans le bon dossier `/public/images/articles/`
- [ ] Test responsive sur mobile, tablette, desktop
- [ ] Vérification de la vitesse de chargement (Google PageSpeed)
- [ ] Les photos respectent les droits d'auteur / RGPD
