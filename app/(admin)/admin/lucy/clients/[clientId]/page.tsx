'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Building2, ArrowLeft, Save, CheckCircle, Clock, XCircle,
  Shield, Monitor, Mic, AlertCircle
} from 'lucide-react'

interface License {
  id: string
  licenseKey: string
  screenName: string
  type: string
  status: string
  email: string
  expiresAt: string | null
  meetingCount: number
  lastMeeting: string | null
}

interface ClientProfile {
  name: string
  company?: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  siret?: string
  vatNumber?: string
  billingEmail?: string
  billingAddress?: string
  billingCity?: string
  billingPostalCode?: string
  paymentTerms?: string
  paymentMethod?: string
  notes?: string
}

function fmtDate(iso: string | null) {
  if (!iso) return '-'
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
  } catch { return iso }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
    active:    { label: 'Active',    cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
    expired:   { label: 'Expiree',  cls: 'bg-amber-500/10  text-amber-400  border-amber-500/20',  icon: Clock },
    suspended: { label: 'Suspendue',cls: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: AlertCircle },
    revoked:   { label: 'Revoquee', cls: 'bg-red-500/10    text-red-400    border-red-500/20',    icon: XCircle },
  }
  const cfg = map[status] ?? { label: status, cls: 'bg-white/[0.05] text-ink-tertiary border-white/[0.08]', icon: Shield }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${cfg.cls}`}>
      <cfg.icon className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  )
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    trial:      'bg-amber-500/10 text-amber-400 border-amber-500/20',
    pro:        'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
    enterprise: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  }
  const labels: Record<string, string> = { trial: 'Essai', pro: 'Pro', enterprise: 'Enterprise' }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${map[type] ?? 'bg-white/[0.05] text-ink-tertiary border-white/[0.08]'}`}>
      {labels[type] ?? type}
    </span>
  )
}

function Field({
  label, name, value, onChange, half, textarea, type = 'text', placeholder
}: {
  label: string
  name: string
  value: string
  onChange: (name: string, val: string) => void
  half?: boolean
  textarea?: boolean
  type?: string
  placeholder?: string
}) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block text-xs font-medium text-ink-tertiary mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full bg-dark-bg border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-quaternary focus:outline-none focus:border-violet-500/40 transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-dark-bg border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-quaternary focus:outline-none focus:border-violet-500/40 transition-colors"
        />
      )}
    </div>
  )
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111827] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.06]">
        <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-violet-400" />
        </div>
        <h2 className="text-sm font-semibold text-ink-primary">{title}</h2>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

export default function ClientDetailPage() {
  const params = useParams<{ clientId: string }>()
  const clientName = decodeURIComponent(params.clientId ?? '')

  const [profile, setProfile] = useState<ClientProfile>({ name: clientName })
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/lucy/clients/${encodeURIComponent(clientName)}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setProfile(data.profile ?? { name: clientName })
      setLicenses(data.licenses ?? [])
    } catch {
      setErr('Impossible de charger les donnees client.')
    } finally {
      setLoading(false)
    }
  }, [clientName])

  useEffect(() => { fetchData() }, [fetchData])

  function handleChange(name: string, val: string) {
    setProfile(p => ({ ...p, [name]: val }))
  }

  async function handleSave() {
    setSaving(true)
    setErr('')
    try {
      const res = await fetch(`/api/admin/lucy/clients/${encodeURIComponent(clientName)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setErr('Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  const activeCount   = licenses.filter(l => l.status === 'active').length
  const totalMeetings = licenses.reduce((s, l) => s + l.meetingCount, 0)

  const v = (field: keyof ClientProfile) => (profile[field] as string) ?? ''

  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a' }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-20 border-b border-white/[0.06]" style={{ background: '#0a0e1a' }}>
        <div className="flex items-center gap-4 px-6 py-3 max-w-4xl mx-auto">
          <Link href="/admin/lucy/clients" className="flex items-center gap-1.5 text-xs text-ink-tertiary hover:text-ink-primary transition-colors flex-shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" />
            Clients
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-ink-primary truncate">{clientName}</h1>
            {profile.company && <p className="text-xs text-ink-tertiary truncate">{profile.company}</p>}
          </div>
          {/* Stats pills */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-medium border border-emerald-500/20">
              {activeCount} actif{activeCount > 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] text-ink-secondary text-[11px] font-medium border border-white/[0.08]">
              <Mic className="w-3 h-3" />{totalMeetings}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] text-ink-secondary text-[11px] font-medium border border-white/[0.08]">
              <Monitor className="w-3 h-3" />{licenses.length}
            </span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
              saved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-violet-600 hover:bg-violet-500 text-white border border-transparent'
            } disabled:opacity-50`}
          >
            {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'Sauvegarde' : saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
        {err && (
          <div className="flex items-center gap-2 p-3.5 bg-red-500/[0.08] border border-red-500/20 rounded-xl text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {err}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-ink-tertiary text-sm">Chargement...</div>
        ) : (
          <>
            {/* Coordonnees */}
            <Section icon={Building2} title="Coordonnees">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Societe" name="company" value={v('company')} onChange={handleChange} placeholder="Acme Corp" />
                <Field label="Nom du contact" name="contactName" value={v('contactName')} onChange={handleChange} half placeholder="Jean Dupont" />
                <Field label="Email" name="email" value={v('email')} onChange={handleChange} half type="email" placeholder="contact@acme.fr" />
                <Field label="Telephone" name="phone" value={v('phone')} onChange={handleChange} half placeholder="+33 6 12 34 56 78" />
                <Field label="Pays" name="country" value={v('country')} onChange={handleChange} half placeholder="France" />
                <Field label="Adresse" name="address" value={v('address')} onChange={handleChange} placeholder="12 rue de la Paix" />
                <Field label="Ville" name="city" value={v('city')} onChange={handleChange} half placeholder="Paris" />
                <Field label="Code postal" name="postalCode" value={v('postalCode')} onChange={handleChange} half placeholder="75001" />
              </div>
            </Section>

            {/* Facturation */}
            <Section icon={Shield} title="Facturation">
              <div className="grid grid-cols-2 gap-4">
                <Field label="SIRET" name="siret" value={v('siret')} onChange={handleChange} half placeholder="123 456 789 00012" />
                <Field label="TVA intracommunautaire" name="vatNumber" value={v('vatNumber')} onChange={handleChange} half placeholder="FR12345678901" />
                <Field label="Email facturation" name="billingEmail" value={v('billingEmail')} onChange={handleChange} type="email" placeholder="compta@acme.fr" />
                <Field label="Adresse de facturation" name="billingAddress" value={v('billingAddress')} onChange={handleChange} placeholder="Identique a l'adresse principale" />
                <Field label="Ville" name="billingCity" value={v('billingCity')} onChange={handleChange} half placeholder="Paris" />
                <Field label="Code postal" name="billingPostalCode" value={v('billingPostalCode')} onChange={handleChange} half placeholder="75001" />
                <Field label="Conditions de paiement" name="paymentTerms" value={v('paymentTerms')} onChange={handleChange} half placeholder="30 jours net" />
                <Field label="Mode de paiement" name="paymentMethod" value={v('paymentMethod')} onChange={handleChange} half placeholder="Virement bancaire" />
              </div>
            </Section>

            {/* Notes internes */}
            <Section icon={AlertCircle} title="Notes internes">
              <div className="grid grid-cols-2 gap-4">
                <Field label="" name="notes" value={v('notes')} onChange={handleChange} textarea placeholder="Notes, contexte, historique commercial..." />
              </div>
            </Section>

            {/* Appareils */}
            {licenses.length > 0 && (
              <Section icon={Monitor} title={`Appareils (${licenses.length})`}>
                <div className="space-y-2">
                  {licenses.map(lic => (
                    <div key={lic.id} className="flex items-center gap-4 p-3 bg-dark-bg rounded-lg border border-white/[0.04]">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Monitor className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-ink-primary">{lic.screenName}</span>
                          <StatusBadge status={lic.status} />
                          <TypeBadge type={lic.type} />
                        </div>
                        <p className="text-[11px] font-mono text-ink-tertiary mt-0.5">{lic.licenseKey}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 flex-shrink-0 text-right">
                        <div>
                          <div className="flex items-center gap-1 text-xs text-ink-secondary">
                            <Mic className="w-3 h-3" />
                            <span className="font-medium">{lic.meetingCount}</span>
                          </div>
                          <p className="text-[10px] text-ink-tertiary">reunions</p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-secondary">{fmtDate(lic.lastMeeting)}</p>
                          <p className="text-[10px] text-ink-tertiary">derniere reunion</p>
                        </div>
                        <div>
                          <p className="text-xs text-ink-secondary">{fmtDate(lic.expiresAt)}</p>
                          <p className="text-[10px] text-ink-tertiary">expiration</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
