# SKILL: Lucy Mode Hors Ligne

## Architecture du mode dégradé

Lucy doit fonctionner sans internet. C'est critique pour les écrans collaboratifs en salle de réunion avec connectivité instable.

### Niveaux de fonctionnement

| Niveau | Connectivité | Transcription | CR | Envoi email |
|--------|-------------|---------------|----|----|
| Normal | Internet OK | AssemblyAI streaming (temps réel) | Claude API (immédiat) | N8N (immédiat) |
| Dégradé | Pas d'internet | whisper.cpp local (post-réunion) | En attente de resync | En attente |
| Resync | Internet revient | Reprocessing via AssemblyAI + Claude | Généré à la resync | Envoyé après resync |

### Détection de perte de connexion
1. `navigator.onLine` (événements browser)
2. Ping du serveur ProjectView toutes les 30 secondes
3. Si 3 pings consécutifs échouent → bascule en mode dégradé
4. Si le ping réussit → tentative de resync

### Ce qui fonctionne en mode offline
- Enregistrement audio (MediaRecorder → fichier local WebM)
- Enregistrement caméra (si activé)
- Capture écran (si activée)
- Transcription locale via whisper.cpp (post-enregistrement, pas temps réel)
- Affichage d'un badge "Hors ligne" sur la pill

### Ce qui ne fonctionne PAS en mode offline
- Transcription temps réel (pas de streaming AssemblyAI)
- Génération du CR (nécessite Claude API)
- Envoi des emails (nécessite N8N)
- Validation de licence (utilise le cache local, valide 72h)

---

## File d'attente SQLite locale

Chaque réunion en mode offline est stockée dans une base SQLite locale gérée par le backend Rust de Tauri.

### Schéma SQLite
```sql
CREATE TABLE offline_queue (
    id TEXT PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending', -- pending, syncing, synced, failed
    
    -- Données de la réunion
    language TEXT NOT NULL,
    participants TEXT NOT NULL, -- JSON array
    duration INTEGER NOT NULL, -- secondes
    auto_stop_minutes INTEGER,
    
    -- Fichiers locaux
    audio_path TEXT NOT NULL,
    camera_path TEXT,
    screen_path TEXT,
    screenshots_json TEXT, -- JSON array de paths
    
    -- Transcription locale (whisper.cpp)
    local_transcript TEXT, -- JSON de la transcription whisper
    
    -- Metadata sync
    sync_attempts INTEGER DEFAULT 0,
    last_sync_error TEXT,
    synced_at TIMESTAMP
);
```

### Pipeline de resync automatique

```typescript
// Pseudo-code du processus de resync
async function resyncOfflineMeetings() {
    const pending = await db.query("SELECT * FROM offline_queue WHERE status = 'pending' ORDER BY created_at ASC");
    
    for (const meeting of pending) {
        try {
            await db.update(meeting.id, { status: 'syncing' });
            
            // 1. Créer la réunion sur le backend
            const { meetingId } = await api.post('/api/lucy/meeting', {
                licenseId: currentLicense.id,
                language: meeting.language,
                participants: JSON.parse(meeting.participants),
                sources: { audio: true, camera: !!meeting.camera_path, screen: !!meeting.screen_path },
                offlineMode: true
            });
            
            // 2. Upload les fichiers vers Nextcloud
            await api.uploadFiles(meetingId, {
                audio: meeting.audio_path,
                camera: meeting.camera_path,
                screen: meeting.screen_path,
                screenshots: meeting.screenshots_json ? JSON.parse(meeting.screenshots_json) : []
            });
            
            // 3. Déclencher la transcription AssemblyAI + CR Claude
            await api.post(`/api/lucy/meeting/${meetingId}/transcribe`);
            
            // 4. Marquer comme synchronisé
            await db.update(meeting.id, { status: 'synced', synced_at: new Date() });
            
            // 5. Supprimer les fichiers locaux
            await deleteLocalFiles(meeting);
            
        } catch (error) {
            await db.update(meeting.id, {
                status: 'pending',
                sync_attempts: meeting.sync_attempts + 1,
                last_sync_error: error.message
            });
        }
    }
}
```

### Stratégie de resync
- Tentative automatique dès que la connexion revient
- Retry avec backoff exponentiel (30s, 1min, 5min, 15min, 1h)
- Maximum 10 tentatives puis statut `failed` (l'utilisateur doit resync manuellement)
- Les réunions sont resync dans l'ordre chronologique (FIFO)
- Notification à l'utilisateur quand la resync est terminée

---

## Cache de licence offline

La validation de licence nécessite internet. Pour ne pas bloquer Lucy en mode offline :

### Mécanisme de cache
```rust
// license_cache.rs
struct LicenseCache {
    key: String,
    status: String,
    expires_at: DateTime,
    cached_at: DateTime,
    cache_validity: Duration, // 72 heures
    features: Features,
}

impl LicenseCache {
    fn is_valid(&self) -> bool {
        let now = Utc::now();
        // La licence est valide si :
        // 1. Le cache n'a pas expiré (< 72h depuis la dernière validation)
        // 2. La licence elle-même n'a pas expiré
        self.cached_at + self.cache_validity > now 
            && self.expires_at > now
            && self.status == "active"
    }
}
```

### Stockage du cache
- Fichier local chiffré AES-256 (clé dérivée du fingerprint device)
- Emplacement : `app_data_dir()/license.cache`
- Renouvelé à chaque validation réussie
- Validité : 72 heures (3 jours)
- Si le cache expire sans possibilité de revalider → Lucy affiche un message et se met en veille (pas de fonctionnement sans licence valide)
