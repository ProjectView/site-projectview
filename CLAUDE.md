# CLAUDE.md — Pulse / site-projectview

> Lu au démarrage. Contexte complet sans re-grep.

## Identité

- **Utilisateur** : Bernard (bernard@projectview.fr), fondateur ProjectView
- **Projet** : Pulse — hub multi-SaaS (Next.js 16, Netlify)
- **Langue** : français / pair technique — applique les fixes directement

## Repo & stack

| Clé | Valeur |
|---|---|
| Repo local | `/Users/projectview/Dev/site-pv-temp` |
| Framework | Next.js 16, App Router |
| Auth | Firebase Auth (email/password + Google) |
| Session | Firestore `users/{uid}` |
| Node | `/usr/local/bin/node` |
| Déploiement | Netlify (branche `main`) |

## RBAC — modèle

3 rôles : `superadmin` / `admin_client` / `user_client`

**Schema `users/{uid}`** :
```
email: string
displayName: string
globalRole: string
orgId: string
enabledApps: { lucy: bool }
appRoles: { lucy: string }
disabled: bool
```

**Collections** : `organizations`, `licenses`, `meetings` (scoped par `orgId`)

## Comptes existants

| Email | UID | globalRole | orgId |
|---|---|---|---|
| bernard@projectview.fr | `xvxe3HUvhiNodCmCtrHoKYeTENy2` | superadmin | `moJgSZOU3P874SBUu2R8` |
| adelin@projectview.fr | `hs9szywkCqS5awAjHTWrL2gJNRz2` | superadmin | `moJgSZOU3P874SBUu2R8` |

Org ProjectView : `organizations/moJgSZOU3P874SBUu2R8`

## Firebase Admin (scripts)

Credentials via Service Account JSON → `.env.local` :
```
FIREBASE_PROJECT_ID=site-projectview
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@site-projectview.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
```
⚠️ **Créer `.env.local` en session, supprimer immédiatement après usage. Ne jamais committer.**

Générer une clé : Firebase Console → Project Settings → Service Accounts → Generate new private key

## Scripts utiles

```bash
cd /Users/projectview/Dev/site-pv-temp

# Migration orgId (idempotent, dry-run par défaut)
node scripts/migrate-orgid.mjs
node scripts/migrate-orgid.mjs --apply

# Dev local
npm run dev
```

## Fichiers clés

| Fichier | Rôle |
|---|---|
| `app/(admin)/admin/lucy/meetings/[id]/page.tsx` | Page réunion + DualPIPPlayer |
| `app/api/admin/lucy/media/route.ts` | Proxy Nextcloud médias |
| `app/api/lucy/meeting/route.ts` | POST depuis Lucy desktop → Firestore |
| `scripts/migrate-orgid.mjs` | Backfill orgId licences + meetings |
| `middleware.ts` | Auth + scoping orgId |

## Pièges connus

| Piège | Solution |
|---|---|
| Barre latérale login visible côté admin | CSS `sidebar { display: none }` dans layout admin |
| `.env.local` avec FIREBASE_PRIVATE_KEY multi-ligne | Wrapper en `"..."` avec `\n` échappés |
| osascript heredoc échoue avec `/` dans le contenu | Écrire via fichier temp monté + `cp` shell |
| Migration : licence sans `clientName` non matchée | Stamper `orgId` directement sur la licence en Console |

## Tags git (site-pv-temp)

| Tag | Contenu |
|---|---|
| `backup-2026-04-14-rbac-complete` | RBAC full stack (scoping orgId + pipeline sync + migration schema) |
| `backup-2026-04-15-orgid-migration-adelin` | ✅ Migration orgId prod (44 meetings) + compte Adelin superadmin |

## État au 15/04/2026

- ✅ RBAC complet (superadmin / admin_client / user_client)
- ✅ Pipeline Lucy → Nextcloud → Firestore (orgId stampé)
- ✅ Migration orgId prod : 44 meetings + licence Bernard stampés
- ✅ Compte Adelin (UID `hs9szywkCqS5awAjHTWrL2gJNRz2`, superadmin, lucy admin)
- ✅ DualPIPPlayer Pulse déployé (cloud)
- ⏳ Intégration Axonaut (paiement)
- ⏳ Landing Page Lucy + download
- ⏳ Login Pulse (page publique)
