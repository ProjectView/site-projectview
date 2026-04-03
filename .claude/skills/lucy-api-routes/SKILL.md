# SKILL: Lucy API Routes & Modèle de Données

## Routes API Next.js

Toutes les routes sont dans `/app/api/lucy/` du projet projectview.fr.

### POST /api/lucy/validate
Valide une licence + fingerprint device. Appelée au lancement de l'app Lucy.

**Body :**
```json
{
  "licenseKey": "LUCY-XXXX-XXXX-XXXX",
  "fingerprint": "sha256-hash-du-device-64-chars",
  "deviceName": "Maxhub Salle Everest",
  "deviceOS": "windows",
  "appVersion": "1.0.0"
}
```

**Réponse 200 :**
```json
{
  "valid": true,
  "type": "subscription",
  "expiresAt": "2026-05-15T00:00:00Z",
  "features": {
    "maxDuration": 180,
    "multiLanguage": true,
    "videoCapture": true,
    "claudeVision": true
  }
}
```

**Réponse 403 :** Licence invalide, expirée, ou fingerprint mismatch.

**Logique :**
1. Chercher la licence par `key` dans Firestore
2. Vérifier que `status === "active"`
3. Vérifier que `fingerprint` correspond (ou est null si première activation)
4. Vérifier que `expiresAt > now()`
5. Mettre à jour `lastValidation` et `deviceName`
6. Retourner les features autorisées

---

### POST /api/lucy/activate
Active une licence sur un device spécifique.

**Body :**
```json
{
  "licenseKey": "LUCY-XXXX-XXXX-XXXX",
  "fingerprint": "sha256-hash",
  "deviceName": "Maxhub Salle Everest",
  "deviceOS": "windows"
}
```

**Logique :**
1. Vérifier que la licence existe et est `active`
2. Si `fingerprint` est déjà set et différent → erreur "déjà activée sur un autre device"
3. Si `fingerprint` est null → écrire le fingerprint (première activation)
4. Créer/mettre à jour le document dans la collection `devices`
5. Retourner success

---

### POST /api/lucy/trial
Crée une licence d'essai 30 jours. Appelée lors du premier lancement.

**Body :**
```json
{
  "fingerprint": "sha256-hash",
  "deviceName": "Maxhub Salle Everest",
  "deviceOS": "windows",
  "email": "admin@entreprise.fr"
}
```

**Logique :**
1. Vérifier qu'aucune licence trial n'existe déjà pour ce fingerprint
2. Générer une clé format `LUCY-XXXX-XXXX-XXXX` (alphanumeric)
3. Créer le document license dans Firestore avec `type: "trial"`, `expiresAt: now() + 30 jours`
4. Créer le document device
5. Envoyer un email de bienvenue via N8N webhook
6. Retourner la clé de licence

---

### POST /api/lucy/meeting
Crée une nouvelle réunion.

**Body :**
```json
{
  "licenseId": "firestore-license-id",
  "language": "fr",
  "participants": ["email1@test.fr", "email2@test.fr"],
  "sources": {
    "audio": true,
    "camera": true,
    "screen": true
  },
  "autoStopMinutes": 10
}
```

**Retour :** `{ "meetingId": "xxx", "wsToken": "token-pour-websocket-assemblyai" }`

---

### POST /api/lucy/meeting/[id]/upload
Upload des fichiers audio/vidéo vers Nextcloud. Multipart form data.

**Fields :**
- `audio` : fichier WebM audio
- `camera` : fichier WebM caméra (optionnel)
- `screen` : fichier WebM capture écran (optionnel)
- `screenshots` : JSON array des captures d'écran (optionnel, pour Claude Vision)

**Logique :**
1. Valider la licence associée à cette réunion
2. Upload chaque fichier vers Nextcloud via WebDAV API
3. Stocker les URLs Nextcloud dans le document meeting Firestore
4. Retourner les URLs

---

### POST /api/lucy/meeting/[id]/transcribe
Déclenche la transcription AssemblyAI + génération CR Claude.

**Logique :**
1. Récupérer l'URL audio depuis Nextcloud
2. Envoyer à AssemblyAI pour transcription avec diarisation
3. Attendre le résultat (polling ou webhook)
4. Envoyer la transcription à Claude API avec le prompt de génération de CR
5. Si captures écran disponibles, envoyer à Claude Vision pour extraction du contenu des slides
6. Générer le PDF du compte rendu
7. Stocker le PDF sur Nextcloud
8. Déclencher le workflow N8N pour envoi email
9. Mettre à jour le statut de la réunion dans Firestore

---

### GET /api/lucy/meeting/[id]
Récupère les détails d'une réunion (CR, fichiers, transcription).

**Auth :** Cookie session client ProjectView.

**Retour :**
```json
{
  "id": "meeting-id",
  "date": "2026-04-02T14:30:00Z",
  "duration": 4523,
  "language": "fr",
  "participants": ["email1@test.fr", "email2@test.fr"],
  "transcript": { "segments": [...] },
  "report": { "summary": "...", "decisions": [...], "actions": [...] },
  "files": {
    "audio": "nextcloud-url",
    "camera": "nextcloud-url",
    "screen": "nextcloud-url",
    "reportPdf": "nextcloud-url"
  },
  "status": "completed"
}
```

---

### GET /api/lucy/meetings
Liste les réunions d'un client (pagination, filtres).

**Query params :** `?page=1&limit=20&from=2026-01-01&to=2026-04-01`

---

### POST /api/stripe/webhook
Reçoit les événements Stripe (paiement réussi, échec, annulation).

**Événements gérés :**
- `checkout.session.completed` → Créer la licence subscription
- `invoice.paid` → Renouveler l'expiration de la licence
- `invoice.payment_failed` → Passer la licence en `suspended`
- `customer.subscription.deleted` → Passer la licence en `expired`

---

## Modèle de Données Firestore

### Collection `licenses`

| Champ | Type | Description |
|-------|------|-------------|
| id | string (auto) | ID unique Firestore |
| key | string | Clé de licence format LUCY-XXXX-XXXX-XXXX |
| type | enum | `trial` \| `subscription` |
| status | enum | `active` \| `expired` \| `suspended` \| `revoked` |
| clientId | string | Référence vers la collection clients existante |
| fingerprint | string | Hash SHA-256 du device (64 caractères) |
| deviceName | string | Nom lisible du device (ex: "Maxhub Salle Everest") |
| deviceOS | string | `windows` \| `android` \| `macos` |
| createdAt | timestamp | Date de création de la licence |
| activatedAt | timestamp | Date d'activation sur le device |
| expiresAt | timestamp | Date d'expiration (trial: +30j, sub: prochaine échéance Stripe) |
| lastValidation | timestamp | Dernière validation réussie |
| stripeSubscriptionId | string \| null | ID abonnement Stripe (null si trial) |
| stripeCustomerId | string \| null | ID client Stripe |
| email | string | Email de l'administrateur de la licence |

### Collection `meetings`

| Champ | Type | Description |
|-------|------|-------------|
| id | string (auto) | ID unique Firestore |
| licenseId | string | Référence vers la licence |
| clientId | string | Référence vers le client |
| date | timestamp | Date/heure de début de la réunion |
| duration | number | Durée en secondes |
| language | string | `fr` \| `en` |
| status | enum | `recording` \| `processing` \| `completed` \| `failed` |
| participants | array<string> | Emails des participants |
| sources | object | `{ audio: bool, camera: bool, screen: bool }` |
| autoStopMinutes | number | Timer d'arrêt automatique (5-15, ou 0 si désactivé) |
| transcript | object | Transcription complète avec segments diarisés |
| report | object | CR structuré (summary, decisions, actions, nextSteps) |
| files | object | URLs Nextcloud (audio, camera, screen, reportPdf) |
| offlineMode | boolean | true si la réunion a été enregistrée en mode offline |
| syncedAt | timestamp \| null | Date de synchronisation si mode offline |

### Collection `devices`

| Champ | Type | Description |
|-------|------|-------------|
| id | string (auto) | ID unique Firestore |
| fingerprint | string | Hash SHA-256 unique du device |
| name | string | Nom lisible |
| os | string | `windows` \| `android` \| `macos` |
| licenseId | string | Licence associée |
| appVersion | string | Version de Lucy installée |
| lastSeen | timestamp | Dernière connexion |
| whisperModelInstalled | boolean | Si le modèle offline est téléchargé |

---

## Génération du Fingerprint par OS

### Windows
```rust
// Combinaison de : MachineGUID (registre) + MAC address primaire + numéro de série disque
let machine_guid = registry::read("HKLM\\SOFTWARE\\Microsoft\\Cryptography\\MachineGuid");
let mac = network::primary_mac_address();
let disk_serial = disk::serial_number();
let fingerprint = sha256(format!("{}-{}-{}", machine_guid, mac, disk_serial));
```

### Android
```rust
// ANDROID_ID + Build.SERIAL + Board
let android_id = Settings.Secure.ANDROID_ID;
let serial = Build.SERIAL;
let board = Build.BOARD;
let fingerprint = sha256(format!("{}-{}-{}", android_id, serial, board));
```

### macOS
```rust
// IOPlatformSerialNumber + MAC address
let serial = ioreg::platform_serial_number();
let mac = network::primary_mac_address();
let fingerprint = sha256(format!("{}-{}", serial, mac));
```
