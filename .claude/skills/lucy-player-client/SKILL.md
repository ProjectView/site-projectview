# SKILL: Lucy Player de Relecture & Espace Client

## Player de relecture web

Le player est accessible sur `projectview.fr/client/lucy/replay/[id]`. C'est une page Next.js dans le projet existant.

### Interface du player

Layout 3 colonnes :
1. **Colonne gauche (60%) :** Lecteur vidéo avec switch caméra/écran
2. **Colonne centrale (25%) :** Transcription scrollable synchronisée avec la vidéo
3. **Colonne droite (15%) :** CR structuré (résumé, décisions, actions)

### Fonctionnalités du player
- Lecture/pause de la vidéo avec raccourcis clavier (espace, flèches)
- Switch entre flux caméra et flux capture d'écran
- Transcription synchronisée : le texte scroll automatiquement avec la vidéo
- Clic sur un passage de la transcription → la vidéo saute au timestamp correspondant
- Recherche dans la transcription (Ctrl+F custom)
- Export du CR en PDF (re-téléchargement)
- Partage via lien sécurisé (token unique, expiration configurable)
- Responsive : sur mobile, les 3 colonnes passent en tabs

### Stack technique du player
- Composant React dans Next.js
- Lecteur vidéo : `react-player` ou HTML5 `<video>` natif
- Fichiers vidéo streamés depuis Nextcloud (URL signée)
- Transcription chargée depuis Firestore
- CR chargé depuis Firestore

### Lien de partage sécurisé
```
https://projectview.fr/client/lucy/replay/MEETING_ID?token=RANDOM_TOKEN
```
- Le token est généré à la création de la réunion
- Le token permet l'accès sans être authentifié sur ProjectView
- Expiration configurable (par défaut : 90 jours, aligné avec la rétention Nextcloud)
- Le token est inclus dans l'email envoyé aux participants

---

## Espace client ProjectView

Lucy s'intègre dans l'espace client existant de projectview.fr. Deux niveaux de visibilité :

### Vue Super Admin (ProjectView)
Page `/admin/lucy` — Dashboard global de toutes les licences.

**Contenu :**
- Nombre total de licences actives / trial / expirées
- Graphique des réunions par jour/semaine/mois
- Liste des licences avec filtres (statut, type, client, OS)
- Actions : révoquer, prolonger, convertir trial en sub
- Revenue mensuel Stripe
- Dernières activités (créations, resync, expirations)

### Vue Client
Page `/client/lucy` — Le client voit ses propres licences et réunions.

**Sections :**

#### Mes licences (`/client/lucy`)
- Liste des licences associées à son compte
- Pour chaque licence : device, OS, statut, date d'expiration
- Bouton "Acheter une licence" (redirection Stripe Checkout)
- Bouton "Gérer mon abonnement" (Stripe Customer Portal)

#### Historique réunions (`/client/lucy/meetings`)
- Liste des réunions avec pagination
- Filtres : date, durée, statut
- Pour chaque réunion : date, durée, nombre de participants, statut
- Lien vers le player de relecture
- Téléchargement direct du PDF du CR
- Badge "Mode offline" si la réunion a été enregistrée hors ligne

#### Player de relecture (`/client/lucy/replay/[id]`)
- Décrit dans la section précédente

---

## Compatibilité multi-plateforme

### Windows (prioritaire)
- Build via Tauri 2.0 → MSI installer
- WebView2 (basé sur Chromium Edge, pré-installé sur Windows 10/11)
- Fingerprint : MachineGUID + MAC + disk serial
- Autostart optionnel (registre Windows)
- Taille installeur : ~15 Mo (+ 460 Mo whisper model téléchargé au 1er lancement)

### Android EDLA (écrans collaboratifs)
- Build via Tauri 2.0 mobile → APK / AAB
- WebView Android System (Chrome-based)
- Fingerprint : ANDROID_ID + Build.SERIAL + Board
- Installation via sideloading (pas Google Play Store pour les écrans EDLA)
- Attention : permissions micro/caméra/écran à gérer dans le manifest
- Taille APK : ~10 Mo (+ whisper model)

### macOS
- Build via Tauri 2.0 → DMG
- WebView WKWebView (Safari-based)
- Fingerprint : IOPlatformSerialNumber + MAC
- Taille DMG : ~12 Mo (+ whisper model)
- Notarization Apple requise pour la distribution

### iOS (futur)
- Build via Tauri 2.0 mobile → IPA
- Distribution via App Store ou TestFlight
- Fingerprint : identifierForVendor
- Limitations : pas de capture d'écran d'autres apps (restriction iOS)
- Lucy sur iOS = mode réduit (audio uniquement)
