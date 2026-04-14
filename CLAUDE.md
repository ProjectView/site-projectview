# CLAUDE.md — Pulse / site-projectview

> Lu au démarrage. Objectif : contexte RBAC complet sans re-grep.

## Identité

- **Utilisateur** : Bernard (bernard@projectview.fr), fondateur ProjectView
- **Projet** : Pulse — hub multi-SaaS (Lucy, Leadgen, Editorial…)
- **Langue** : français
- **Relation** : pair technique — applique les fixes, ne demande pas permission

## Repo & stack

| Clé | Valeur |
|---|---|
| Local | `/Users/projectview/Dev/site-pv-temp` |
| Framework | Next.js 16 App Router + Netlify |
| Auth | Firebase Auth + Firestore + Firebase Admin SDK |
| Session | HttpOnly `__session` cookie + readable `__user_info` |
| Node | `/usr/local/bin/node` |

## RBAC — modèle (stable depuis 2026-04-14)

**3 rôles globaux** : `superadmin` / `admin_client` / `user_client`

**Mono-org avec hiérarchie** : `organizations` collection, `parentOrgId` pour nesting.
ProjectView = racine (type=projectview). Les sous-orgs = clients.

**Apps registry** : `apps` collection (lucy, leadgen, editorial…) + `orgs_apps` pour activation par org.

### Helpers RBAC — `lib/rbac.ts`
- `getSessionUser(req)` → user depuis cookie session
- `requireRole(user, roles[])` → guard
- `canActOnOrg(user, orgId)` → bool
- `listChildOrganizations(orgId)` → descendants
- `getAllowedOrgIds(user)` → liste pour scoping Firestore
- `applyOrgScope<T>(query, allowedOrgIds)` → injecte `where('orgId','in',…)` ou sentinelle `__NONE__`

### Stratégie scoping (validée)
**Stratégie A — stamp orgId everywhere** avec override manuel pour superadmin.
- Licences scopées par orgId
- Meetings scopés par orgId (stampé depuis licence au POST `/api/lucy/meeting`)
- Sélecteur d'org dans Create modal licences (superadmin peut override, admin_client forcé sur son org)

## Fichiers clés RBAC

| Fichier | Rôle |
|---|---|
| `lib/rbac.ts` | Helpers session + scope |
| `lib/firestore-users.ts` | CRUD users via Firestore |
| `app/api/admin/session/route.ts` | Login/logout avec __user_info |
| `app/api/admin/users/route.ts` | CRUD users (superadmin + admin_client) |
| `app/api/admin/users/[id]/route.ts` | Update/delete user |
| `app/api/admin/orgs/route.ts` | Liste orgs scopée |
| `app/api/admin/apps/route.ts` | Registry apps |
| `app/(admin)/admin/users/page.tsx` | UI CRUD users + toggles apps |
| `app/api/admin/lucy/meetings/route.ts` | **Scopé orgId** |
| `app/api/admin/lucy/licenses/route.ts` | **Scopé orgId + POST avec orgId** |
| `app/api/admin/lucy/clients/route.ts` | **Scopé orgId** |
| `app/api/admin/lucy/stats/route.ts` | **Scopé orgId** |
| `app/(admin)/admin/lucy/licenses/page.tsx` | Sélecteur org dans Create modal |
| `app/api/lucy/meeting/route.ts` | **Stamp orgId au POST sync Lucy** |

## Scripts

| Script | Usage |
|---|---|
| `scripts/seed-rbac.mjs` | Seed org ProjectView + superadmin Bernard + app Lucy |
| `scripts/migrate-orgid.mjs` | Backfill orgId sur licences+meetings + CSV orphelins. Flags : `(dry-run)` / `--apply` |

Prérequis : `.env.local` avec `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (à pull depuis Netlify env).

## Pipeline Lucy → Pulse

Lucy App poste vers `POST /api/lucy/meeting` avec Bearer = licenseKey.
Le handler :
1. Valide la licence (`findLicenseByKey`)
2. Vérifie status + expiry
3. **Stampe `orgId` depuis la licence** (null si orpheline)
4. `meetingRef.set({…, orgId, …}, { merge: true })`

## Transfer pattern Mac ↔ sandbox

Le sandbox Linux et Mac ont des FS séparés. Pour déployer un fichier :
```bash
# Sandbox
base64 -w 0 src > src.b64

# Via mcp__Control_your_Mac__osascript
cat > /tmp/X.b64 <<'LUCY_EOF'
<base64 content>
LUCY_EOF
base64 -d -i /tmp/X.b64 -o /Users/projectview/Dev/.../target.ts
```
macOS `base64` exige `-i INPUT -o OUTPUT` (pas de redirection).

## JAMAIS sans demander

- `git reset --hard` / `git push --force`
- Toucher à `.env.local` prod
- Supprimer collections Firestore

## Tags git (site-pv-temp)

| Tag | Contenu |
|---|---|
| `backup-2026-04-14-rbac-complete` | ✅ RBAC full stack — scoping + pipeline + migration script |

## État au 14/04/2026

- ✅ 3 rôles RBAC + org hierarchy + apps registry
- ✅ `lib/rbac.ts` avec getAllowedOrgIds + applyOrgScope
- ✅ 4 APIs admin/lucy scopées (meetings, licenses, clients, stats)
- ✅ Sélecteur org dans Create modal licences
- ✅ Pipeline sync Lucy stampe orgId sur meetings
- ✅ Script migration one-shot prêt (dry-run + CSV orphelins)
- ⏳ Run migration en prod (quand `.env.local` dispo)
- ⏳ Paiement Axonaut
- ⏳ Landing Page Lucy + download + login Pulse

## Fichier CLAUDE.md lucy-app

Projet desktop séparé : `/Users/projectview/Dev/lucy-app/CLAUDE.md` — agent IA de réunion macOS Tauri. Ne pas confondre.
