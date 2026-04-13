'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users, Monitor, Clock, TrendingUp, Mic, Key, ChevronRight,
  AlertCircle, RefreshCw, Euro, Building2
} from 'lucide-react'

interface Stats {
  clients: number
  activeDevices: number
  trialLicenses: number
  paidLicenses: number
  monthlyRevenue: number
  totalLicenses: number
  totalMeetings: number
  recentMeetings: number
}

function StatCard({
  label, value, sub, icon: Icon, color, href, trend,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  color: string
  href?: string
  trend?: string
}) {
  const router = useRouter()
  return (
    <div
      onClick={() => href && router.push(href)}
      className={`bg-dark-surface border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-3 ${href ? 'cursor-pointer hover:border-white/[0.15] transition-all hover:bg-white/[0.03]' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {href && <ChevronRight className="w-4 h-4 text-ink-tertiary opacity-50" />}
      </div>
      <div>
        <p className="text-3xl font-bold text-ink-primary tabular-nums">{value}</p>
        <p className="text-sm text-ink-tertiary mt-0.5">{label}</p>
        {sub && <p className="text-xs text-ink-tertiary/60 mt-1">{sub}</p>}
        {trend && <p className="text-xs text-emerald-400 mt-1 font-medium">{trend}</p>}
      </div>
    </div>
  )
}

export default function LucyDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  async function fetchStats() {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/lucy/stats')
      if (!res.ok) throw new Error('Erreur API')
      setStats(await res.json())
    } catch {
      setErr('Impossible de charger les statistiques.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-purple flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-ink-primary">Lucy — Dashboard</h1>
          </div>
          <p className="text-sm text-ink-tertiary">Vue globale des licences et de l&apos;activité</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-dark-surface border border-white/[0.08] rounded-lg text-sm text-ink-secondary hover:text-ink-primary hover:border-white/[0.15] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {err && (
        <div className="flex items-center gap-2 p-4 bg-red-500/[0.08] border border-red-500/20 rounded-xl mb-6 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {err}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Clients"
          value={loading ? '…' : (stats?.clients ?? 0)}
          sub="entreprises actives"
          icon={Building2}
          color="bg-brand-teal/15 text-brand-teal"
          href="/admin/lucy/clients"
        />
        <StatCard
          label="Devices actifs"
          value={loading ? '…' : (stats?.activeDevices ?? 0)}
          sub="licences status=active"
          icon={Monitor}
          color="bg-blue-500/15 text-blue-400"
          href="/admin/lucy/licenses"
        />
        <StatCard
          label="Licences trial"
          value={loading ? '…' : (stats?.trialLicenses ?? 0)}
          sub={loading ? '' : `sur ${stats?.totalLicenses ?? 0} total`}
          icon={Key}
          color="bg-amber-500/15 text-amber-400"
          href="/admin/lucy/licenses?type=trial"
        />
        <StatCard
          label="Revenu mensuel"
          value={loading ? '…' : `${stats?.monthlyRevenue ?? 0} €`}
          sub={loading ? '' : `${stats?.paidLicenses ?? 0} licence${(stats?.paidLicenses ?? 0) > 1 ? 's' : ''} payante${(stats?.paidLicenses ?? 0) > 1 ? 's' : ''}`}
          icon={Euro}
          color="bg-emerald-500/15 text-emerald-400"
          trend={stats && stats.paidLicenses > 0 ? `≈ ${stats.monthlyRevenue * 12} € / an` : undefined}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Réunions totales"
          value={loading ? '…' : (stats?.totalMeetings ?? 0)}
          sub="enregistrements sync Firestore"
          icon={Mic}
          color="bg-brand-purple/15 text-brand-purple"
          href="/admin/lucy/meetings"
        />
        <StatCard
          label="Réunions (7 derniers jours)"
          value={loading ? '…' : (stats?.recentMeetings ?? 0)}
          sub="activité récente"
          icon={TrendingUp}
          color="bg-pink-500/15 text-pink-400"
        />
      </div>

      {/* Quick actions */}
      <div className="bg-dark-surface border border-white/[0.08] rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-ink-secondary mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: 'Créer une licence',
              desc: 'Générer une clé LUCY-XXXX-XXXX-XXXX',
              icon: Key,
              color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
              href: '/admin/lucy/licenses?action=create',
            },
            {
              label: 'Voir les clients',
              desc: 'Arborescence client › device › meeting',
              icon: Building2,
              color: 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal',
              href: '/admin/lucy/clients',
            },
            {
              label: 'Gérer les licences',
              desc: 'Activer, révoquer, prolonger',
              icon: Users,
              color: 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple',
              href: '/admin/lucy/licenses',
            },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all hover:opacity-80 ${item.color}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
