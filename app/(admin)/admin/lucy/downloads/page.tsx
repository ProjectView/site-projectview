'use client'
import { useState, useEffect } from 'react'
import { Download, Apple, Monitor, Smartphone, RefreshCw, ExternalLink, Tag, Clock, CheckCircle } from 'lucide-react'

interface BuildAsset {
  platform: 'macos' | 'windows' | 'android'
  version: string
  fileName: string
  downloadUrl: string
  fileSize: string
  releaseDate: string
  sha256?: string
}

interface ReleaseInfo {
  version: string
  releaseDate: string
  releaseNotes: string
  assets: BuildAsset[]
  githubUrl: string
}

const PLATFORM_META = {
  macos: {
    label: 'macOS',
    icon: Apple,
    desc: 'Universal (Intel + Apple Silicon)',
    ext: '.dmg',
    color: '#f0f2f5',
    badge: 'macOS 12+',
    iconColor: '#f0f2f5',
  },
  windows: {
    label: 'Windows',
    icon: Monitor,
    desc: 'Windows 10/11 (x64)',
    ext: '.exe',
    color: '#0078d4',
    badge: 'Windows 10+',
    iconColor: '#4fc3f7',
  },
  android: {
    label: 'Android',
    icon: Smartphone,
    desc: 'Android 10+ (ARM64)',
    ext: '.apk',
    color: '#34a853',
    badge: 'Android 10+',
    iconColor: '#66bb6a',
  },
}

export default function LucyDownloadsPage() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchRelease = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    try {
      const res = await fetch('/api/admin/lucy/downloads')
      if (!res.ok) throw new Error('Erreur API')
      const data = await res.json()
      setRelease(data)
      setError('')
    } catch (e) {
      setError('Impossible de charger les informations de release.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchRelease() }, [])

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-secondary">
        <RefreshCw className="w-5 h-5 animate-spin mr-3" /> Chargement…
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary mb-1">
            Téléchargements Lucy
          </h1>
          <p className="text-sm text-ink-secondary">
            Builds officiels — essai gratuit 15 jours à l'installation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRelease(true)}
                onClick={() => fetchRelease(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-ink-secondary bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Rafraîchir
          </button>
          {release?.githubUrl && (
            <a
              href={release.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white/[0.08] hover:bg-white/[0.12] text-ink-primary border border-white/[0.08] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              GitHub Releases
            </a>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Version banner */}
      {release && (
        <div className="mb-8 p-5 bg-brand-teal/[0.08] border border-brand-teal/20 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-teal/20 flex items-center justify-center flex-shrink-0">
            <Tag className="w-5 h-5 text-brand-teal" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink-primary">
              Version {release.version} — {fmtDate(release.releaseDate)}
            </div>
            <div className="text-xs text-ink-secondary mt-0.5">{release.releaseNotes}</div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-brand-teal font-medium">
            <CheckCircle className="w-4 h-4" />
            Stable
          </div>
        </div>
      )}

      {/* Trial info */}
      <div className="mb-8 p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-start gap-3">
        <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-ink-primary mb-1">Essai gratuit 15 jours</div>
          <div className="text-xs text-ink-secondary leading-relaxed">
            À l'installation, Lucy démarre automatiquement une période d'essai de 15 jours sans aucune configuration.
            Un email est demandé pour activer l'essai et recevoir la clé. Après expiration, une licence est nécessaire.
          </div>
        </div>
      </div>

      {/* Download cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {(['macos', 'windows', 'android'] as const).map((platform) => {
          const meta = PLATFORM_META[platform]
          const asset = release?.assets.find((a) => a.platform === platform)
          const Icon = meta.icon

          return (
            <div
              key={platform}
              className="bg-dark-card border border-white/[0.08] rounded-xl p-5 flex flex-col"
            >
              {/* Platform header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${meta.color}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: meta.iconColor }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-primary">{meta.label}</div>
                  <div className="text-xs text-ink-tertiary">{meta.desc}</div>
                </div>
              </div>

              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.07] text-ink-secondary">{meta.badge}</span>
                 <span className="text-[10px] font-mono text-ink-tertiary">{meta.ext}</span>
              </div>

              {asset ? (
                <>
                  <div className="flex-1 space-y-1.5 mb-4 text-xs text-ink-secondary">
                    <div className="flex justify-between">
                      <span>Version</span>
                      <span className="font-mono text-ink-primary">{asset.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taille</span>
                      <span>{asset.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date</span>
                      <span>{fmtDate(asset.releaseDate)}</span>
                    </div>
                    {asset.sha256 && (
                      <div
                        className="mt-2 p-2 bg-white/[0.04] rounded-lg font-mono text-[10px] text-ink-tertiary cursor-pointer hover:bg-white/[0.07] transition-colors break-all"
                        title="Cliquer pour copier le SHA-256"
                        onClick={() => copyToClipboard(asset.sha256!)}
                      >
                       SHA256: {asset.sha256.slice(0, 16)}…
                      </div>
                    )}
                  </div>
                  <a
                    href={asset.downloadUrl}
                    download
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${meta.color}cc, ${meta.color}88)`,
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </a>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="text-xs text-ink-tertiary">Build non disponible</div>
                  <div className="text-xs text-ink-tertiary mt-1">Lancer le workflow CI/CD</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Installation instructions */}
      <div className="bg-dark-card border border-white/[0.08] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-ink-primary mb-4">📋 Instructions d'installation</h2>
        <div className="space-y-4">
          {[
            {
              platform: '🍎 macOS',
              steps: [
                'Télécharger le fichier .dmg',
                'Ouvrir le .dmg et glisser Lucy.app dans Applications/',
                'Premier lancement : Cmd+clic → Ouvrir (bypass Gatekeeper)',
                'Saisir votre email pour activer l\'essai 15 jours',
              ],
            },
            {
              platform: '🪟 Windows',
              steps: [
                'Télécharger le fichier .exe',
                'Lancer l\'installateur et suivre les étapes',
                'Autoriser l\'accès micro quand demandé',
                'Saisir votre email pour activer l\'essai 15 jours',
              ],
            },
            {
              platform: '🤖 Android',
              steps: [
                'Télécharger le fichier .apk',
                'Activer "Sources inconnues" dans Paramètres → Sécurité',
                'Ouvrir le fichier .apk pour installer',
                'Saisir votre email pour activer l\'essai 15 jours',
              ],
            },
          ].map(({ platform, steps }) => (
            <div key={platform}>
              <div className="text-xs font-semibold text-ink-secondary mb-2">{platform}</div>
              <ol className="space-y-1">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-ink-tertiary">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-white/[0.06] text-[10px] flex items-center justify-center mt-0.5 font-medium">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
