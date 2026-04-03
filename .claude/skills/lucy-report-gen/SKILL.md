# SKILL: Lucy Report Generation (Claude API + Vision)

## Génération du Compte Rendu Structuré

### Prompt Claude pour le CR

Le backend envoie la transcription complète à Claude API (Sonnet) avec ce prompt system :

```
Tu es un assistant expert en rédaction de comptes rendus de réunion. Tu reçois la transcription complète d'une réunion avec identification des intervenants.

Génère un compte rendu structuré au format JSON avec les sections suivantes :

1. **Résumé exécutif** (3-5 phrases) : les points essentiels de la réunion
2. **Participants** : liste des intervenants identifiés avec leur rôle si mentionné
3. **Points abordés** : les sujets discutés, organisés par thème
4. **Décisions prises** : les décisions validées pendant la réunion, avec le contexte
5. **Actions à mener** : les tâches assignées, avec responsable et échéance si mentionnés
6. **Prochaines étapes** : ce qui est prévu après cette réunion
7. **Notes complémentaires** : tout élément important non classé ailleurs

Règles :
- Sois factuel et précis, ne brode pas
- Attributs chaque décision et action à l'intervenant qui l'a proposée/acceptée
- Si une échéance est mentionnée, note-la
- Si un montant ou chiffre est cité, reporte-le exactement
- La langue du CR doit correspondre à la langue de la réunion
- Format de sortie : JSON strictement valide, sans markdown
```

### Format JSON de sortie attendu

```json
{
  "summary": "Résumé exécutif de la réunion...",
  "participants": [
    {
      "speaker": "Speaker A",
      "name": "Bernard Duval",
      "role": "Directeur"
    }
  ],
  "topics": [
    {
      "title": "Budget Q3",
      "discussion": "Discussion sur le dépassement du budget marketing...",
      "keyPoints": ["Point 1", "Point 2"]
    }
  ],
  "decisions": [
    {
      "decision": "Réallouer 23K€ du poste événementiel vers le digital",
      "proposedBy": "Sophie Martin",
      "approvedBy": "Bernard Duval",
      "context": "Le budget digital est en dépassement de 15%"
    }
  ],
  "actions": [
    {
      "action": "Préparer le document de réallocation budgétaire",
      "assignedTo": "Sophie Martin",
      "deadline": "15 avril 2026",
      "priority": "high"
    }
  ],
  "nextSteps": [
    "Prochaine réunion budget le 20 avril à 14h",
    "Sophie envoie le document de réallocation avant vendredi"
  ],
  "notes": "Thomas a mentionné une marge supplémentaire de 8K sur le poste déplacements."
}
```

---

## Claude Vision pour l'analyse des slides

Si la capture d'écran est activée, des screenshots sont pris toutes les 30 secondes pendant la réunion. À la fin, les screenshots sont envoyés à Claude Vision pour extraire le contenu des slides partagées.

### Prompt Claude Vision

```
Tu reçois des captures d'écran prises pendant une réunion. 
Analyse chaque capture et extrais :
1. Le texte visible (titres, bullet points, contenus)
2. Les données chiffrées (graphiques, tableaux)
3. Les schémas ou diagrammes (description textuelle)

Retourne un JSON avec le timestamp de chaque capture et le contenu extrait.
Ignore les captures qui montrent des interfaces d'applications (menus, barres d'outils) 
sans contenu de présentation.
```

### Pipeline d'intégration dans le CR
1. Les captures sont envoyées à Claude Vision (batch)
2. Le contenu extrait est ajouté au prompt de génération du CR
3. Le CR final peut référencer "Cf. slide présentée à 14:32 — Graphique des ventes Q3"
4. Les captures pertinentes sont intégrées dans le PDF du CR

---

## Génération du PDF

Le PDF du compte rendu est généré côté backend avec la librairie `@react-pdf/renderer` ou `pdfkit`.

### Structure du PDF
1. **En-tête :** Logo ProjectView + "Compte Rendu de Réunion" + date
2. **Infos pratiques :** Date, durée, participants, lieu (si mentionné)
3. **Résumé exécutif** (encadré vert ProjectView)
4. **Points abordés** (sections avec titres)
5. **Décisions** (icône ✓ + texte)
6. **Actions** (tableau : action | responsable | échéance | priorité)
7. **Prochaines étapes** (liste numérotée)
8. **Notes** (si présentes)
9. **Pied de page :** "Généré par Lucy — projectview.fr" + n° de page

### Charte graphique du PDF
- Police : Inter ou Calibri
- Couleur primaire : #00D4AA (vert ProjectView)
- Couleur texte : #1A1A2E (quasi-noir)
- Couleur secondaire : #6C757D (gris)
- Couleur accent : #FF6B6B (pour les priorités hautes)
- Marges : 2cm partout

---

## Workflow N8N pour l'envoi email

### Déclencheur
Le backend appelle un webhook N8N après la génération du PDF.

### Payload du webhook
```json
{
  "meetingId": "xxx",
  "participants": ["email1@test.fr", "email2@test.fr"],
  "reportPdfUrl": "https://nextcloud.projectview.fr/path/to/report.pdf",
  "replayUrl": "https://projectview.fr/client/lucy/replay/xxx",
  "meetingDate": "2026-04-02T14:30:00Z",
  "meetingSummary": "Résumé en 2 lignes..."
}
```

### Template email
```
Objet : Compte rendu — Réunion du [date]

Bonjour,

Le compte rendu de votre réunion du [date] est disponible.

📋 Résumé : [résumé 2 lignes]

📄 Télécharger le PDF : [lien]
🎥 Relire la réunion : [lien player]

---
Généré par Lucy — projectview.fr
```

### Workflow N8N de purge (90 jours)
- Déclencheur : CRON toutes les nuits à 3h
- Action : Lister les fichiers Nextcloud > 90 jours → supprimer
- Mettre à jour le statut dans Firestore (`status: "archived"`)
- Les données textuelles (transcript, report) restent dans Firestore
