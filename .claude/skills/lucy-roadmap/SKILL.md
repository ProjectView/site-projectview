# SKILL: Lucy Roadmap & Instructions Claude Code/Cowork

## Roadmap de développement — 6 phases sur 24 semaines

| Phase | Semaines | Contenu | Livrable |
|-------|----------|---------|----------|
| 1. Fondations | 1-3 | Tauri + React, système de licence, backend API, auth | App qui démarre, s'active, valide sa licence |
| 2. Capture | 4-8 | Micro + écran + caméra, MediaRecorder, sélection sources, enregistrement local WebM, upload Nextcloud | Enregistrement fonctionnel des 3 flux |
| 3. Transcription | 9-11 | AssemblyAI streaming + diarisation, affichage live, multilingue FR/EN | Transcription temps réel visible dans l'app |
| 4. Intelligence | 12-15 | CR structuré via Claude, Claude Vision sur captures écran, génération PDF, workflow N8N email | CR reçu par email après chaque réunion |
| 5. Player web | 16-18 | App web de relecture, synchro vidéo/transcription, basculement caméra/écran, CR latéral, lien sécurisé | Relecture fonctionnelle sur projectview.fr |
| 6. Offline + Polish | 19-24 | whisper.cpp sidecar, file d'attente, resync auto, fin auto (timer), pill draggable, tests Maxhub, builds Android/macOS | Produit complet prêt à la commercialisation |

---

## Phase 1 : Fondations (Semaines 1-3)

### Objectif
Application Tauri qui démarre, affiche la pill Lucy, gère les licences (trial + activation + validation).

### Tâches détaillées

#### 1.1 Setup projet Tauri
- Initialiser un projet Tauri 2.0 avec React + TypeScript + TailwindCSS
- Configurer la fenêtre overlay (transparent, alwaysOnTop, decorations: false)
- Configurer le build multi-plateforme (Windows prioritaire)
- Setup ESLint + Prettier + Vitest

#### 1.2 Composant Pill (État 1 — Veille)
- Créer le composant Pill.tsx avec les styles de la pill grise
- Implémenter le dragging sur les bords de l'écran (via Tauri window API)
- Point gris + texte "Lucy" + chevron

#### 1.3 Animation morph (État 1 → État 2)
- Implémenter l'animation morph CSS (pill → panneau de configuration)
- Timing : 450ms, cubic-bezier(0.4, 0, 0.2, 1)
- Fade in/out du contenu avec délai 200ms

#### 1.4 Panneau de configuration (État 2)
- Layout du panneau : logo animé, sélection sources (placeholder), zone emails, bouton démarrer
- Logo ProjectView avec gradient cycling arc-en-ciel
- Fermeture au tap en dehors ou swipe down

#### 1.5 Backend Rust — Fingerprint
- Implémenter fingerprint.rs : génération SHA-256 par OS
- Windows : MachineGUID + MAC + disk serial
- Tester sur au moins 2 machines différentes

#### 1.6 API Routes Backend (projectview.fr)
- POST /api/lucy/trial — Création licence d'essai
- POST /api/lucy/activate — Activation licence
- POST /api/lucy/validate — Validation licence
- Créer les collections Firestore : licenses, devices
- Tests unitaires pour chaque route

#### 1.7 Cache licence local
- Implémenter license_cache.rs : stockage chiffré AES-256
- Logique de cache : validité 72h, fallback si pas de connexion
- Lecture/écriture dans app_data_dir()

#### 1.8 Écran d'onboarding
- Écran "Bienvenue" au premier lancement
- Saisie email → création trial → affichage clé
- Transition vers l'état Veille

### Critères de validation Phase 1
- [ ] Lucy s'installe sur Windows (MSI)
- [ ] La pill s'affiche en overlay always-on-top
- [ ] L'animation morph fonctionne à 60fps
- [ ] L'onboarding crée un trial de 30 jours
- [ ] La validation de licence fonctionne online et offline (cache)
- [ ] Le dashboard admin affiche la licence créée

---

## Phase 2 : Capture (Semaines 4-8)

### Objectif
Lucy capture l'audio, la caméra et l'écran simultanément et upload les fichiers.

### Tâches détaillées

#### 2.1 Sélection des sources
- Énumérer les devices audio disponibles (navigator.mediaDevices.enumerateDevices)
- Dropdown de sélection micro dans le panneau de configuration
- Toggle caméra ON/OFF + sélection caméra
- Toggle capture écran ON/OFF

#### 2.2 Capture audio
- MediaRecorder API avec format WebM/Opus
- Sélection du device audio choisi par l'utilisateur
- Indicateur de niveau sonore dans l'UI (barre VU-mètre)

#### 2.3 Capture caméra
- getUserMedia avec la caméra sélectionnée
- Prévisualisation dans le panneau avant l'enregistrement
- Enregistrement en WebM

#### 2.4 Capture écran
- getDisplayMedia pour la capture d'écran
- Screenshots automatiques toutes les 30 secondes (pour Claude Vision)
- Enregistrement continu en WebM

#### 2.5 État Enregistrement (État 3)
- Pill verte avec point pulsant + chronomètre
- Overlay transcription au tap (placeholder pour Phase 3)
- Très discret

#### 2.6 Upload vers Nextcloud
- Upload des fichiers WebM via WebDAV API Nextcloud
- Progress bar pendant l'upload
- Stockage des URLs dans Firestore (document meeting)
- API route POST /api/lucy/meeting + POST /api/lucy/meeting/[id]/upload

#### 2.7 Gestion de la fin d'enregistrement
- Tap long (1.5s) → boutons Stop / Continuer
- Bouton Stop → passage à l'État 5 (Traitement)

### Critères de validation Phase 2
- [ ] L'utilisateur peut sélectionner micro, caméra, écran
- [ ] Les 3 flux s'enregistrent simultanément en WebM
- [ ] Les fichiers sont uploadés avec succès sur Nextcloud
- [ ] La pill en mode enregistrement affiche le chronomètre
- [ ] L'arrêt d'enregistrement fonctionne via tap long

---

## Phase 3 : Transcription (Semaines 9-11)

### Objectif
Transcription en temps réel avec identification des intervenants.

### Tâches détaillées

#### 3.1 Intégration AssemblyAI
- WebSocket streaming vers AssemblyAI via le backend proxy
- Configuration : language_code, speaker_labels, punctuate
- Gestion des erreurs et reconnection

#### 3.2 Proxy backend
- API route WebSocket sur le backend ProjectView
- Le backend proxy le flux audio vers AssemblyAI
- Et renvoie les résultats vers l'app Lucy

#### 3.3 Affichage live
- Composant TranscriptPanel.tsx
- Affichage des dernières lignes de transcription
- Speaker labels avec couleurs distinctes
- Auto-scroll vers le bas

#### 3.4 Overlay transcription
- Au tap sur la pill en enregistrement → overlay déroulant
- Affiche la transcription en temps réel
- Swipe down ou tap en dehors pour fermer

#### 3.5 Sélection de langue
- FR / EN dans le panneau de configuration
- Changement de paramètre AssemblyAI en conséquence

### Critères de validation Phase 3
- [ ] La transcription s'affiche en temps réel (< 2 secondes de latence)
- [ ] Les speakers sont identifiés et colorés différemment
- [ ] Le français et l'anglais fonctionnent
- [ ] L'overlay de transcription s'ouvre/ferme fluidement

---

## Phase 4 : Intelligence (Semaines 12-15)

### Objectif
Génération automatique du CR structuré et envoi par email.

### Tâches détaillées

#### 4.1 Prompt Claude
- Implémenter l'appel à Claude API (Sonnet) avec le prompt de CR
- Parser la réponse JSON
- Stocker dans Firestore (document meeting, champ report)

#### 4.2 Claude Vision
- Envoyer les screenshots (captures écran) à Claude Vision
- Extraire le contenu des slides
- Intégrer dans le contexte du CR

#### 4.3 Génération PDF
- Template PDF aux couleurs ProjectView
- Sections : résumé, participants, points, décisions, actions, prochaines étapes
- Stockage sur Nextcloud

#### 4.4 Workflow N8N
- Webhook N8N déclenché après la génération du PDF
- Template email avec liens vers le PDF et le player
- Envoi à tous les participants

#### 4.5 État Traitement (État 5)
- Pill violette avec "Traitement..." et dots animés
- Progress des étapes (upload, transcription, CR, email)
- Retour automatique en veille quand terminé

### Critères de validation Phase 4
- [ ] Le CR est généré automatiquement en < 2 minutes
- [ ] Le PDF est professionnel et lisible
- [ ] L'email arrive avec le PDF et le lien player
- [ ] La pill de traitement montre la progression

---

## Phase 5 : Player web (Semaines 16-18)

### Objectif
Page de relecture complète sur projectview.fr.

### Tâches détaillées

#### 5.1 Page player Next.js
- Route /client/lucy/replay/[id]
- Layout 3 colonnes : vidéo, transcription, CR
- Responsive (tabs sur mobile)

#### 5.2 Synchronisation vidéo/transcription
- Clic sur un passage de transcription → vidéo saute au timestamp
- Auto-scroll de la transcription pendant la lecture
- Highlight du passage en cours

#### 5.3 Switch caméra/écran
- Boutons pour basculer entre le flux caméra et le flux écran
- Transition fluide

#### 5.4 Lien sécurisé
- Token unique par réunion
- Accès sans authentification via le token
- Expiration configurable

#### 5.5 Espace client
- /client/lucy — Liste des licences
- /client/lucy/meetings — Historique des réunions
- Intégration dans le menu existant de projectview.fr

### Critères de validation Phase 5
- [ ] Le player affiche vidéo + transcription synchronisée
- [ ] Le switch caméra/écran fonctionne
- [ ] Le lien partageable fonctionne sans login
- [ ] L'espace client liste les réunions correctement

---

## Phase 6 : Offline + Polish (Semaines 19-24)

### Objectif
Mode hors ligne complet, arrêt automatique, builds multi-plateforme.

### Tâches détaillées

#### 6.1 whisper.cpp sidecar
- Intégrer whisper.cpp comme sidecar Rust
- Téléchargement du modèle ggml-small au premier lancement (460 Mo)
- Transcription locale post-enregistrement

#### 6.2 File d'attente SQLite
- Créer la base SQLite locale (offline_queue)
- Stocker les réunions en attente de sync
- Pipeline de resync automatique au retour de connexion

#### 6.3 Détection de connectivité
- Hook useConnectivity.ts
- Bascule automatique online ↔ offline
- Badge dans l'UI

#### 6.4 Arrêt automatique (État 4 — Countdown)
- Détection d'inactivité : analyse volume RMS + comparaison frames
- Timer configurable 5-15 minutes (slider dans la config)
- Overlay countdown avec boutons Continuer / Arrêter
- Annulation automatique si activité détectée

#### 6.5 Pill draggable
- Drag sur les bords de l'écran via Tauri window API
- Snapping sur les bords (left, right, bottom)
- Persistence de la position entre les sessions

#### 6.6 Tests Maxhub
- Tester sur écrans Maxhub réels (tactile, résolution, performances)
- Ajuster les zones de touch si nécessaire
- Vérifier les performances (animation 60fps)

#### 6.7 Builds multi-plateforme
- Windows : MSI via Tauri
- Android : APK via Tauri mobile
- macOS : DMG via Tauri + notarization Apple

#### 6.8 Documentation utilisateur
- Guide de démarrage rapide (1 page)
- FAQ
- Guide administrateur (gestion des licences)

### Critères de validation Phase 6
- [ ] Le mode offline fonctionne transparemment
- [ ] La resync se fait automatiquement au retour de connexion
- [ ] L'arrêt automatique se déclenche correctement
- [ ] Lucy fonctionne sur Windows + Android EDLA
- [ ] Les animations sont fluides sur écrans Maxhub

---

## Instructions pour Claude Code / Claude Cowork

### Comment utiliser ce projet

1. **Chaque phase est autonome.** Ouvrez une session Claude Code dédiée à une phase.
2. **Lisez le skill correspondant** avant de coder. Exemple : pour la Phase 1, lisez `lucy-ui-states/SKILL.md` et `lucy-licenses/SKILL.md`.
3. **Utilisez le plan mode** (shift+tab dans Claude Code) pour les tâches complexes.
4. **Faites d'abord un plan** puis codez. Ne codez jamais sans plan validé.
5. **Testez à chaque étape.** Chaque sous-tâche doit avoir un critère de validation.
6. **Utilisez `/compact`** quand la session devient longue pour préserver le contexte.
7. **Utilisez `/clear`** entre les phases pour repartir propre.

### Variables d'environnement requises

```env
# Backend (projectview.fr)
ASSEMBLYAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXTCLOUD_URL=https://nextcloud.projectview.fr
NEXTCLOUD_USERNAME=xxx
NEXTCLOUD_PASSWORD=xxx
N8N_WEBHOOK_URL=https://n8n.projectview.fr/webhook/lucy-email
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY=xxx

# App Lucy (Tauri)
VITE_API_BASE_URL=https://projectview.fr/api/lucy
VITE_APP_VERSION=1.0.0
```

### Commandes utiles

```bash
# Repo projectview.fr
npm run dev          # Lancer le dev server Next.js
npm run build        # Build production
npm run test         # Lancer les tests

# Repo lucy-app
npm run tauri dev    # Lancer en mode dev (ouvre la fenêtre Tauri)
npm run tauri build  # Build pour Windows
npm run tauri android dev  # Dev Android
npm run tauri android build  # Build APK
```
