# SKILL: Lucy Système de Licences

## Modèle de licence

- **1 licence = 1 device** (lié par fingerprint hardware)
- **Essai gratuit 30 jours** : automatique au premier lancement, sans carte bancaire
- **Abonnement payant** : 29€/mois via Stripe
- **Pas de système tiers** : les licences sont gérées directement dans Firestore (pas de Keygen.sh)

---

## Format de clé de licence

```
LUCY-XXXX-XXXX-XXXX
```
Où X = caractère alphanumérique majuscule (A-Z, 0-9). Généré côté backend.

```typescript
function generateLicenseKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    return `LUCY-${segment()}-${segment()}-${segment()}`;
}
```

---

## Flux d'activation

### Premier lancement (Trial)
```
1. Lucy démarre → pas de licence en cache local
2. Lucy affiche l'écran d'onboarding : "Bienvenue ! Essayez Lucy gratuitement pendant 30 jours"
3. L'utilisateur saisit son email
4. Lucy génère le fingerprint device (via Rust)
5. Appel POST /api/lucy/trial avec { fingerprint, deviceName, deviceOS, email }
6. Le backend crée la licence trial dans Firestore (30 jours)
7. Le backend envoie un email de bienvenue avec la clé
8. Lucy stocke la licence en cache local (chiffré AES-256)
9. Lucy passe en état "Veille" → prête à enregistrer
```

### Activation d'une licence payante
```
1. Le client achète une licence sur projectview.fr (Stripe Checkout)
2. Stripe webhook → le backend crée une licence subscription dans Firestore
3. Le client reçoit la clé par email : LUCY-XXXX-XXXX-XXXX
4. Dans Lucy → menu → "Activer une licence"
5. Saisie de la clé + validation
6. Appel POST /api/lucy/activate avec { licenseKey, fingerprint, deviceName, deviceOS }
7. Le backend lie le fingerprint à la licence
8. Lucy met à jour le cache local
```

### Validation au lancement
```
1. Lucy démarre → lit le cache local
2. Si cache valide (< 72h et licence non expirée) → démarrage immédiat
3. Si cache expiré ou absent → appel POST /api/lucy/validate
4. Si validation OK → mise à jour du cache, démarrage
5. Si validation échoue et cache encore dans les 72h → démarrage (mode tolérant)
6. Si validation échoue et cache > 72h → écran "Connexion requise"
```

---

## Intégration Stripe

### Checkout Session
Le client achète une licence depuis `projectview.fr/client/lucy` via Stripe Checkout.

```typescript
// API route : /api/stripe/create-checkout
const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
        price: 'price_lucy_monthly_29eur',
        quantity: 1,
    }],
    success_url: 'https://projectview.fr/client/lucy?success=true',
    cancel_url: 'https://projectview.fr/client/lucy?canceled=true',
    metadata: {
        clientId: client.id,
        product: 'lucy',
    },
});
```

### Webhook Stripe
```typescript
// API route : /api/stripe/webhook
switch (event.type) {
    case 'checkout.session.completed':
        // Créer la licence subscription dans Firestore
        // Envoyer la clé par email au client
        break;
        
    case 'invoice.paid':
        // Renouveler expiresAt de la licence (+1 mois)
        break;
        
    case 'invoice.payment_failed':
        // Passer la licence en status "suspended"
        // Envoyer un email d'alerte au client
        // La licence reste fonctionnelle pendant 7 jours (grâce période)
        break;
        
    case 'customer.subscription.deleted':
        // Passer la licence en status "expired"
        // L'app Lucy affichera "Licence expirée" au prochain lancement
        break;
}
```

### Customer Portal
Pour que le client puisse gérer son abonnement (changer de carte, annuler) :

```typescript
const portalSession = await stripe.billingPortal.sessions.create({
    customer: license.stripeCustomerId,
    return_url: 'https://projectview.fr/client/lucy',
});
// Rediriger vers portalSession.url
```

---

## Dashboard Admin Licences

Page `/admin/lucy` — Accessible uniquement aux super admins ProjectView.

### Métriques affichées
- Licences actives (total + par type trial/sub)
- Taux de conversion trial → paid
- MRR (Monthly Recurring Revenue)
- Réunions enregistrées (total + par jour)
- Durée moyenne des réunions
- Top clients par nombre de réunions

### Actions admin
- **Créer une licence** : pour un client existant, attribuer une clé manuellement
- **Révoquer** : désactiver immédiatement une licence
- **Prolonger trial** : étendre la période d'essai (pour un prospect stratégique)
- **Changer de device** : dissocier le fingerprint pour permettre un transfert
- **Voir l'historique** : toutes les validations, activations, erreurs d'une licence
