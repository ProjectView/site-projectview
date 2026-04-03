# SKILL: Lucy Transcription (AssemblyAI + whisper.cpp)

## Mode en ligne : AssemblyAI Universal-2

### Configuration
- **API :** AssemblyAI Streaming (WebSocket)
- **Modèle :** Universal-2 (meilleure qualité multilingue)
- **Diarisation :** Activée (identification des intervenants)
- **Langues :** Français, Anglais (sélection dans l'UI)
- **Coût :** ~0,17$/heure d'enregistrement

### Flux streaming temps réel
1. L'app Lucy capture l'audio via MediaRecorder (format WebM/Opus)
2. Les chunks audio sont envoyés au backend ProjectView via WebSocket
3. Le backend proxie vers l'API streaming d'AssemblyAI
4. AssemblyAI retourne les mots transcrits en temps réel + speaker labels
5. Le backend renvoie à l'app Lucy pour affichage live

### Paramètres AssemblyAI
```javascript
const config = {
  encoding: "pcm_s16le",
  sample_rate: 16000,
  language_code: "fr",         // ou "en"
  speaker_labels: true,         // diarisation
  punctuate: true,
  format_text: true,
  word_boost: [],               // termes métier à booster si nécessaire
};
```

### Diarisation (identification des speakers)
AssemblyAI attribue automatiquement un label (Speaker A, Speaker B, etc.) à chaque segment de parole. Dans l'UI Lucy :
- Chaque speaker reçoit une couleur distincte
- Les noms réels sont associés manuellement ou via les emails des participants
- La transcription affiche : `[Speaker A — 14:32] "Texte transcrit..."`

---

## Mode hors ligne : whisper.cpp

### Configuration
- **Technologie :** whisper.cpp intégré comme sidecar Rust dans Tauri
- **Modèle :** ggml-small (~460 Mo), bon compromis qualité/taille
- **Téléchargement :** Au premier lancement (pas embarqué dans l'installeur pour garder <20 Mo)
- **Performance :** Temps réel sur CPU x86_64 (AVX2) et ARM (NEON)

### Téléchargement du modèle
```rust
// Au premier lancement ou quand l'utilisateur active le mode offline
async fn download_whisper_model() {
    let model_url = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin";
    let model_path = app_data_dir().join("whisper-models/ggml-small.bin");
    
    if !model_path.exists() {
        // Téléchargement progressif en arrière-plan
        // Afficher une progress bar dans l'UI
        download_with_progress(model_url, &model_path).await;
    }
}
```

### Limites du mode offline
- Pas de diarisation native (whisper.cpp ne fait pas de speaker separation)
- Transcription en batch (pas de streaming temps réel) — la transcription se fait après l'enregistrement
- Qualité légèrement inférieure au mode en ligne
- Pas de génération de CR (Claude API nécessite internet) — le CR sera généré à la resync

### Pipeline offline
1. Lucy détecte la perte de connexion (`navigator.onLine === false` + ping serveur)
2. Bascule automatique vers whisper.cpp pour la transcription locale
3. L'audio est enregistré localement (fichier WebM)
4. En fin de réunion, whisper.cpp transcrit l'audio localement
5. La transcription brute + les fichiers sont stockés dans la file d'attente SQLite locale
6. Au retour de la connexion, tout est uploadé et reprocessé (AssemblyAI + Claude)

---

## Détection de connectivité

```typescript
// useConnectivity.ts
const useConnectivity = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('https://projectview.fr/api/lucy/ping', {
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000)
        });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };
    
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkConnection, 30000);
    
    // Écouter les événements natifs
    window.addEventListener('online', () => checkConnection());
    window.addEventListener('offline', () => setIsOnline(false));
    
    return () => clearInterval(interval);
  }, []);
  
  return { isOnline };
};
```

### Badge de connectivité dans l'UI
- En ligne : pas d'indicateur (c'est l'état normal)
- Hors ligne : petit badge orange "Hors ligne" sur la pill Lucy
- Resync en cours : badge bleu "Synchronisation..."
