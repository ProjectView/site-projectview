/**
 * /download — Page publique de téléchargement de Lucy
 * Récupère les assets depuis la dernière GitHub Release (ISR 5 min).
 * Pas d'auth requise — accessible à tous les clients.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Télécharger Lucy — ProjectView',
  description: 'Lucy, votre agent IA de réunion. Disponible sur macOS, Windows et Android EDLA.',
}

export const revalidate = 300

const GITHUB_REPO = 'ProjectView/lucy-app'

interface GithubAsset {
  name: string
  browser_download_url: string
  size: number
  updated_at: string
}

interface ReleaseInfo {
  version: string
  releaseDate: string
  githubUrl: string
  assets: {
    macos: { url: string; name: string; size: string } | null
    windows: { url: string; name: string; size: string } | null
    android: { url: string; name: string; size: string } | null
  }
}

function fmtSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${((bytes / 1024 / 1024).toFixed(1))} Mo`
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function getLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
        next: { revalidate: 300 },
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const assets = data.assets as GithubAsset[]
    const find = (pred: (n: string) => boolean) => {
      const a = assets.find(a => pred(a.name.toLowerCase()))
      return a ? { url: a.browser_download_url, name: a.name, size: fmtSize(a.size) } : null
    }
    return {
      version: data.tag_name?.replace('v', '') || '—',
      releaseDate: data.published_at || data.created_at,
      githubUrl: data.html_url,
      assets: {
        macos:   find(n => n.endsWith('.dmg')),
        windows: find(n => n.endsWith('.exe')),
        android: find(n => n.endsWith('.apk')),
      },
    }
  } catch {
    return null
  }
}

function DownloadButton({ href, label, sublabel }: { href?: string; label: string; sublabel?: string }) {
  if (!href) {
    return (
      <span className="lucy-btn lucy-btn--disabled">
        <span className="lucy-btn-label">{label}</span>
        {sublabel && <span className="lucy-btn-sub">{sublabel}</span>}
      </span>
    )
  }
  return (
    <a href={href} download className="lucy-btn lucy-btn--primary">
      <span className="lucy-btn-label">{label}</span>
      {sublabel && <span className="lucy-btn-sub">{sublabel}</span>}
    </a>
  )
}

export default async function DownloadPage() {
  const release = await getLatestRelease()
  const platforms = [
    {
      id: 'macos', icon: '', name: 'macOS',
      subtitle: 'Universal — Apple Silicon & Intel',
      requirement: 'macOS 12 Monterey ou supérieur',
      asset: release?.assets.macos ?? null, badge: null,
      installSteps: [
        'Télécharge le fichier <code>.dmg</code> ci-dessous',
        'Ouvre le fichier <code>Lucy_x.x.x_universal.dmg</code>',
        'Fais glisser <strong>Lucy.app</strong> dans le dossier Applications',
        'Au premier lancement : clic droit → <em>Ouvrir</em> (contourne Gatekeeper)',
        'Lucy apparaît en haut à droite de ta barre de menu — clique pour démarrer',
      ],
    },
    {
      id: 'windows', icon: '🪟' , name: 'Windows',
      subtitle: 'Installer NSIS (.exe)',
      requirement: 'Windows 10 / 11 (64 bits)',
      asset: release?.assets.windows ?? null, badge: null,
      installSteps: [
        'Télécharge le fichier <code>.exe</code> ci-dessous',
        'Lance <strong>Lucy_x.x.x_x64-setup.exe</strong> (admin recommandé)',
        "L'installeur configure Ollama automatiquement",
        'Lucy se place dans la barre des tâches système',
        "Accorde l'accès micro lorsque Windows demande",
      ],
    },
    {
      id: 'android', icon: '🤖', name: 'Android EDLA',
      subtitle: 'Écrans collaboratifs & affichage dynamique',
      requirement: 'Android 10+ · Appareils EDLA certifiés',
      asset: release?.assets.android ?? null, badge: 'EDLA',
      installSteps: [
        'Active <strong>Sources inconnues</strong> dans Paramètres → Sécurité',
        'Transfère le fichier <code>.apk</code> sur l\'écran (USB ou réseau local)',
        "Lance l'APK depuis le gestionnaire de fichiers",
        'Configure l\'URL du serveur Pulse dans les réglages Lucy',
        "L\'écran affiche le résumé en temps réel",
      ],
    },
  ]
  return (
    <>
      <style>{`:root{--lucy-purple:#6B5CE7;--lucy-purple-light:rgba(107,92,231,.12);--lucy-text:#1a1a2e;--lucy-muted:#6b7280;--lucy-border:rgba(0,0,0,.08)}*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8f7ff;color:var(--lucy-text)}.dl-page{max-width:960px;margin:0 auto;padding:64px 24px 80px}.dl-header{text-align:center;margin-bottom:56px}.dl-logo{display:inline-flex;align-items:center;gap:10px;margin-bottom:20px;text-decoration:none;color:inherit}.dl-logo-dot{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6B5CE7,#a78bfa);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:700}.dl-logo-name{font-size:22px;font-weight:700;letter-spacing:-.5px}.dl-title{font-size:clamp(28px,5vw,40px);font-weight:800;letter-spacing:-1px;margin-bottom:12px}.dl-title span{color:var(--lucy-purple)}.dl-subtitle{font-size:16px;color:var(--lucy-muted);max-width:520px;margin:0 auto 24px;line-height:1.6}.dl-version-badge{display:inline-flex;align-items:center;gap:6px;background:var(--lucy-purple-light);border:1px solid rgba(107,92,231,.25);color:var(--lucy-purple);font-size:13px;font-weight:600;padding:5px 14px;border-radius:99px}.dl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-bottom:56px}.dl-card{background:#fff;border:1px solid var(--lucy-border);border-radius:16px;padding:28px;display:flex;flex-direction:column;gap:16px;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:box-shadow .2p}.dl-card:hover{box-shadow:0 4px 16px rgba(107,92,231,.1)}.dl-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.dl-card-icon{font-size:28px;line-height:1}.dl-card-badge{font-size:10px;font-weight:700;letter-spacing:.08em;background:#f3f0ff;color:var(--lucy-purple);border:1px solid rgba(107,92,231,.3);padding:3px 8px;border-radius:99px;margin-top:2px}.dl-card-name{font-size:20px;font-weight:700;letter-spacing:-.3px}.dl-card-sub{font-size:13px;color:var(--lucy-muted);margin-top:2px}.dl-card-req{font-size:12px;color:var(--lucy-muted);background:#f9f9f9;border-radius:8px;padding:8px 12px}.lucy-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:12px 20px;border-radius:12px;font-weight:600;text-decoration:none;transition:background .15s,transform .1s;border:none}.lucy-btn--primary{background:var(--lucy-purple);color:#fff}.lucy-btn--primary:hover{background:#5a4dd6;transform:translateY(-1px)}.lucy-btn--disabled{background:#f3f4f6;color:#9ca3af;cursor:not-allowed}.lucy-btn-label{font-size:14px}.lucy-btn-sub{font-size:11px;opacity:.75}.dl-steps-title{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--lucy-muted);margin-bottom:8px}.dl-steps{list-style:none;display:flex;flex-direction:column;gap:8px}.dl-steps li{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.5;color:#374151}.dl-steps li::before{content:attr(data-step);flex-shrink:0;width:20px;height:20px;border-radius:50%;background:var(--lucy-purple-light);color:var(--lucy-purple);font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:1px}.dl-steps code{font-family:'SF Mono',Consolas,monospace;font-size:12px;background:#f3f4f6;padding:1px 5px;border-radius:4px;color:#5b4fcf}.dl-divider{height:1px;background:var(--lucy-border);margin:4px 0}.dl-info{background:#fff;border:1px solid var(--lucy-border);border-radius:16px;padding:28px 32px;margin-bottom:32px}.dl-info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:24px}.dl-info-item h4{font-size:13px;font-weight:700;color:var(--lucy-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}.dl-info-item p{font-size:15px;font-weight:500;color:var(--lucy-text);line-height:1.5}.dl-info-item a{color:var(--lucy-purple);text-decoration:none;font-weight:600}.dl-footer{text-align:center;font-size:13px;color:var(--lucy-muted);line-height:1.7}.dl-footer a{color:var(--lucy-purple);text-decoration:none}.dl-no-release{text-align:center;padding:40px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;font-size:14px;color:#92400e;margin-bottom:32px}`}</style>
      <div className="dl-page">
        <div className="dl-header">
          <a className="dl-logo" href="https://projectview.fr">
            <div className="dl-logo-dot">L</div><span className="dl-logo-name">Lucy</span>
          </a>
          <h1 className="dl-title">Votre agent IA de réunion<br /><span>disponible sur toutes vos plateformes</span></h1>
          <p className="dl-subtitle">Lucy transcrit, résume et partage vos réunions. Aucune donnée ne quitte vos serveurs en mode local.</p>
          {release ? (<span className="dl-version-badge">✦ Version {release.version} · {fmtDate(release.releaseDate)}</span>) : (<span className="dl-version-badge" style={{background:'#fef9c3',borderColor:'#fde68a',color:'#854d0e'}}>⩡ Premier build en cours, revenez bientôt</span>)}
        </div>
        {!release && <div className="dl-no-release">🚛 Aucune release GitHub. Lance le workflow <strong>Build &amp; Release Lucy</strong> avec un tag <code>v0.1.0</code>.</div>}
        <div className="dl-grid">
          {platforms.map(p => (
            <div className="dl-card" key={p.id}>
              <div className="dl-card-header"><div><div className="dl-card-icon">{p.icon}</div><div className="dl-card-name">{p.name}</div><div className="dl-card-sub">{p.subtitle}</div></div>{p.badge && <span className="dl-card-badge">{p.badge}</span>}</div>
              <div className="dl-card-req"><strong>Requis :</strong> {p.requirement}</div>
              <DownloadButton href={p.asset?.url} label={p.asset ? `~ Télécharger ${p.name}` : `Bientôt disponible`} sublabel={p.asset ? `${p.asset.name} · ${p.asset.size}` : undefined} />
              <div className="dl-divider" />
              <div><p className="dl-steps-title">Guide d'installation</p><ol className="dl-steps">{p.installSteps.map((s, i) => <li key={i} data-step={String(i+1)} dangerouslySetInnerHTML={{__html:s}} />)}</ol></div>
            </div>
          ))}
        </div>
        <div className="dl-info"><div className="dl-info-grid">
          <div className="dl-info-item"><h4>🔒 Confidentialité</h4><p>Mode local : aucune donnée ne quitte votre machine. Whisper + Ollama tournent 100 % en local.</p></div>
          <div className="dl-info-item"><h4>⏱ Essai gratuit</h4><p>15 jours sans carte bancaire. <a href="https://projectview.fr/client/lucy" target="_blank" rel="noopener">Activer la licence</a>.</p></div>
          <div className="dl-info-item"><h4>🆕 Mises à jour</h4><p>Sur <a href={release?.githubUrl ?? `https://github.com/${GITHUB_REPO}/releases`} target="_blank" rel="noopener">GitHub Releases</a>.</p></div>
          <div className="dl-info-item"><h4>💬 Support</h4><p><a href="mailto:support@projectview.fr">support@projectview.fr</a> ou via Pulse.</p></div>
        </div></div>
        <div className="dl-footer"><p>Lucy est un produit <a href="https://projectview.fr" target="_blank" rel="noopener">ProjectView</i>.</p></div>
      </div>
    </>
  )
}
