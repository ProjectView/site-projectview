'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Building2, Users, Monitor, Euro, Mic, Key, TrendingUp,
  AlertCircle, RefreshCw, ChevronRight, LayoutGrid, ShieldCheck,
  Globe,
} from 'lucide-react'

interface OrgRow {
  id: string
  name: string
  type: string
  plan: string
  licenses: number
  meetings: number
  revenue: number
}

interface Stats {
  totalOrgs: number
  clientFinalCount: number
  resellerCount: number
  totalUsers: number
  totalLicenses: number
  activeLicenses: number
  trialLicenses: number
  paidLicenses: number
  monthlyRevenue: number
  totalMeetings: number
  recentMeetings: number
  orgBreakdown: OrgRow[]
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

const TYPE_LABELS: Record<string, string> = {
  projectview: 'ProjectView',
  reseller: 'Revendeur',
  client_final: 'Client final',
}
const TYPE_COLORS: Record<string, string> = {
  projectview: 'bg-brand-teal/15 text-brand-teal',
  reseller: 'bg-brand-purple/15 text-brand-purple',
  client_final: 'bg-blue-500/15 text-blue-400',
}
const PLAN_COLORS: Record<string, string> = {
  starter: 'bg-white/[0.06] text-ink-tertiary',
  pro:     'bg-amber-500/15 text-amber-400',
  enterprise: 'bg-emerald-500/15 text-emerald-400',
}

export default function OverviewPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  async function fetchStats() {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/overview')
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
              <Globe className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-ink-primary">Vue d&apos;ensemble</h1>
          </div>
          <p className="text-sm text-ink-tertiary">Tableau de bord global — superadmin uniquement</p>
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

      {/* KPI primaires */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Organisations"
          value={loading ? '…' : (stats?.totalOrgs ?? 0)}
          sub={loading ? '' : `${stats?.clientFinalCount ?? 0} clients · ${stats?.resellerCount ?? 0} revendeurs`}
          icon={Building2}
          color="bg-brand-teal/15 text-brand-teal"
          href="/admin/organisations"
        />
        <StatCard
          label="Utilisateurs"
          value={loading ? '…' : (stats?.totalUsers ?? 0)}
          sub="comptes Pulse actifs"
          icon={Users}
          color="bg-blue-500/15 text-blue-400"
          href="/admin/users"
        />
        <StatCard
          label="Devices actifs (Lucy)"
          value={loading ? '…' : (stats?.activeLicenses ?? 0)}
          sub={loading ? '' : `sur ${stats?.totalLicenses ?? 0} licences totales`}
          icon={Monitor}
          color="bg-brand-purple/15 text-brand-purple"
          href="/admin/lucy/licenses"
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

      {/* KPI secondaires */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Licences trial"
          value={loading ? '…' : (stats?.trialLicenses ?? 0)}
          sub="en cours d'évaluation"
          icon={Key}
          color="bg-amber-500/15 text-amber-400"
          href="/admin/lucy/licenses?type=trial"
        />
        <StatCard
          label="Licences payantes"
          value={loading ? '…' : (stats?.paidLicenses ?? 0)}
          sub="actives & facturées"
          icon={ShieldCheck}
          color="bg-emerald-500/15 text-emerald-400"
          href="/admin/lucy/licenses?type=paid"
        />
        <StatCard
          label="Réunions totales"
          value={loading ? '…' : (stats?.totalMeetings ?? 0)}
          sub="sync Firestore"
          icon={Mic}
          color="bg-pink-500/15 text-pink-400"
          href="/admin/lucy/meetings"
        />
        <StatCard
          label="Réunions (7 jours)"
          value={loading ? '…' : (stats?.recentMeetings ?? 0)}
          sub="activité récente"
          icon={TrendingUp}
          color="bg-orange-500/15 text-orange-400"
        />
      </div>

      {/* Raccourcis sections */}
      <div className="bg-dark-surface border border-white/[0.08] rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-ink-secondary mb-4">Accès rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: 'Organisations',
              desc: 'Arborescence & CRUD des orgs',
              icon: Building2,
              color: 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal',
              href: '/admin/organisations',
            },
            {
              label: 'Utilisateurs',
              desc: 'Gestion des comptes & rôles',
              icon: Users,
              color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
              href: '/admin/users',
            },
            {
              label: 'Lucy — Dashboard',
              desc: 'Licences, clients, réunions',
              icon: LayoutGrid,
              color: 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple',
              href: '/admin/lucy/dashboard',
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

      {/* Tableau par organisation */}
      <div className="bg-dark-surface border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-secondary">
            Activité par organisation
          </h2>
          {!loading && stats && (
            <span className="text-xs text-ink-tertiary">{stats.orgBreakdown.length} org{stats.orgBreakdown.length > 1 ? 's' : ''}</span>
          )}
        </div>
        {loading ? (
          <div className="p-8 text-center text-ink-tertiary text-sm">Chargement…</div>
        ) : !stats || stats.orgBreakdown.length === 0 ? (
          <div className="p-8 text-center text-ink-tertiary text-sm">Aucune organisation.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Organisation</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Plan</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Licences</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Réunions</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wider">Revenu/mois</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {stats.orgBreakdown.map(org => (
                  <tr
                    key={org.id}
                    onClick={() => router.push('/admin/organisations')}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-ink-primary">{org.name}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[org.type] ?? 'bg-white/[0.06] text-ink-tertiary'}`}>
                        {TYPE_LABELS[org.type] ?? org.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${PLAN_COLORS[org.plan] ?? 'bg-white/[0.06] text-ink-tertiary'}`}>
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-ink-secondary">
                      {org.licenses > 0 ? (
                        <span className="text-brand-teal font-semibold">{org.licenses}</span>
                      ) : (
                        <span className="text-ink-tertiary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums text-ink-secondary">
                      {org.meetings > 0 ? org.meetings : <span className="text-ink-tertiary">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">
                      {org.revenue > 0 ? (
                        <span className="text-emerald-400 font-semibold">{org.revenue} €</span>
                      ) : (
                        <span className="text-ink-tertiary">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Total row */}
              <tfoot className="border-t border-white/[0.08]">
                <tr className="bg-white/[0.02]">
                  <td className="px-5 py-3 text-xs font-semibold text-ink-secondary uppercase tracking-wider" colSpan={3}>Total</td>
                  <td className="px-4 py-3 text-right tabular-nums text-xs font-semibold text-brand-teal">
                    {stats.activeLicenses}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-xs font-semibold text-ink-secondary">
                    {stats.totalMeetings}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-xs font-semibold text-emerald-400">
                    {stats.monthlyRevenue} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
