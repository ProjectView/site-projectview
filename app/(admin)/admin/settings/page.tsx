'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Users,
  Building2,
  Search as SearchIcon,
  Plug,
  Save,
  Plus,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  Key,
  Globe,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { Toast, ToastType } from '@/components/admin/Toast';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

type Tab = 'profile' | 'users' | 'company' | 'seo' | 'integrations';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface SiteSettings {
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
  };
  social: {
    linkedin: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    analyticsId: string;
  };
  integrations: {
    n8nWebhook: string;
    githubConnected: boolean;
    netlifyConnected: boolean;
  };
}

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'company', label: 'Entreprise', icon: Building2 },
  { id: 'seo', label: 'SEO', icon: SearchIcon },
  { id: 'integrations', label: 'Intégrations', icon: Plug },
];

function getUserInfo() {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(/(?:^|;\s*)__user_info=([^;]*)/);
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match[1])) as { name?: string; email?: string };
  } catch {
    return null;
  }
}

export default function SettingsPage() {
  const [userInfo, setUserInfo] = useState<{ name?: string; email?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [saving, setSaving] = useState(false);

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [showNewUser, setShowNewUser] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Password change
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Settings state
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch { /* silent */ }
    finally { setLoadingUsers(false); }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch { /* silent */ }
  };

  useEffect(() => {
    setUserInfo(getUserInfo());
    fetchUsers();
    fetchSettings();
  }, []);

  // Save settings
  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Erreur');
      setToast({ message: 'Paramètres sauvegardés !', type: 'success' });
    } catch {
      setToast({ message: 'Erreur lors de la sauvegarde.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setToast({ message: 'Le mot de passe doit contenir au moins 6 caractères.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ message: 'Les mots de passe ne correspondent pas.', type: 'error' });
      return;
    }

    // Find current user in users list
    const currentUser = users.find((u) => u.email === userInfo?.email);
    if (!currentUser) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error('Erreur');
      setNewPassword('');
      setConfirmPassword('');
      setToast({ message: 'Mot de passe modifié !', type: 'success' });
    } catch {
      setToast({ message: 'Erreur lors du changement de mot de passe.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Create user
  const handleCreateUser = async () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      setToast({ message: 'Tous les champs sont requis.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNewUserForm({ name: '', email: '', password: '', role: 'admin' });
      setShowNewUser(false);
      setToast({ message: 'Utilisateur créé !', type: 'success' });
      fetchUsers();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur';
      setToast({ message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteUserId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDeleteUserId(null);
      setToast({ message: 'Utilisateur supprimé.', type: 'success' });
      fetchUsers();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur';
      setToast({ message, type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteUserId}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Il ne pourra plus se connecter."
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteUserId(null)}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-ink-secondary text-sm mt-1">
          Gérez votre profil, vos utilisateurs et la configuration du site.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 rounded-lg bg-white/[0.02] border border-white/[0.06] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white/[0.08] text-ink-primary'
                : 'text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile info */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary mb-4">
              Informations du compte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">Nom</label>
                <input
                  type="text"
                  defaultValue={userInfo?.name || ''}
                  readOnly
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-ink-primary outline-none opacity-70"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={userInfo?.email || ''}
                  readOnly
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-ink-primary outline-none opacity-70"
                />
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-4 h-4 text-ink-tertiary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                Changer le mot de passe
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">Confirmer</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors"
                />
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              disabled={saving}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-white/[0.06] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.10] hover:text-ink-primary transition-all cursor-pointer disabled:opacity-50"
            >
              Mettre à jour
            </button>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Users list */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
                Administrateurs ({users.length})
              </h2>
              <button
                onClick={() => setShowNewUser(!showNewUser)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Ajouter
              </button>
            </div>

            {/* New user form */}
            {showNewUser && (
              <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder="Nom"
                    className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors"
                  />
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="Email"
                    className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors"
                  />
                  <input
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                    placeholder="Mot de passe"
                    className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-ink-primary outline-none cursor-pointer appearance-none"
                  >
                    <option value="admin" className="bg-dark-surface">Admin</option>
                    <option value="editor" className="bg-dark-surface">Éditeur</option>
                  </select>
                  <button
                    onClick={handleCreateUser}
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-teal text-white hover:bg-brand-teal/80 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Créer
                  </button>
                  <button
                    onClick={() => setShowNewUser(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-ink-secondary hover:text-ink-primary transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Users rows */}
            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-purple/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-brand-teal" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink-primary">{user.name}</p>
                        <p className="text-xs text-ink-tertiary">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-ink-secondary">
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                      <button
                        onClick={() => setDeleteUserId(user.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'company' && settings && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary mb-4">
              Informations entreprise
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField icon={Building2} label="Nom" value={settings.company.name}
                onChange={(v) => setSettings({ ...settings, company: { ...settings.company, name: v } })} />
              <InputField icon={Mail} label="Email" value={settings.company.email}
                onChange={(v) => setSettings({ ...settings, company: { ...settings.company, email: v } })} />
              <InputField icon={Phone} label="Téléphone" value={settings.company.phone}
                onChange={(v) => setSettings({ ...settings, company: { ...settings.company, phone: v } })} />
              <InputField icon={Globe} label="Site web" value={settings.company.website}
                onChange={(v) => setSettings({ ...settings, company: { ...settings.company, website: v } })} />
            </div>
            <div className="mt-4">
              <InputField icon={MapPin} label="Adresse" value={settings.company.address}
                onChange={(v) => setSettings({ ...settings, company: { ...settings.company, address: v } })} />
            </div>
          </div>

          {/* Social */}
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary mb-4">
              Réseaux sociaux
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="LinkedIn" value={settings.social.linkedin} placeholder="https://linkedin.com/company/..."
                onChange={(v) => setSettings({ ...settings, social: { ...settings.social, linkedin: v } })} />
              <InputField label="Twitter / X" value={settings.social.twitter} placeholder="https://x.com/..."
                onChange={(v) => setSettings({ ...settings, social: { ...settings.social, twitter: v } })} />
              <InputField label="Instagram" value={settings.social.instagram} placeholder="https://instagram.com/..."
                onChange={(v) => setSettings({ ...settings, social: { ...settings.social, instagram: v } })} />
              <InputField label="YouTube" value={settings.social.youtube} placeholder="https://youtube.com/..."
                onChange={(v) => setSettings({ ...settings, social: { ...settings.social, youtube: v } })} />
            </div>
          </div>

          <button onClick={handleSaveSettings} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      )}

      {activeTab === 'seo' && settings && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary mb-4">
              SEO par défaut
            </h2>
            <div className="space-y-4">
              <InputField label="Titre par défaut" value={settings.seo.defaultTitle}
                onChange={(v) => setSettings({ ...settings, seo: { ...settings.seo, defaultTitle: v } })} />
              <div>
                <label className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
                  Description par défaut
                </label>
                <textarea
                  value={settings.seo.defaultDescription}
                  onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, defaultDescription: e.target.value } })}
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-ink-primary outline-none focus:border-brand-teal/50 transition-all resize-none"
                />
              </div>
              <InputField label="Google Analytics ID" value={settings.seo.analyticsId} placeholder="G-XXXXXXXXXX"
                onChange={(v) => setSettings({ ...settings, seo: { ...settings.seo, analyticsId: v } })} />
            </div>
          </div>
          <button onClick={handleSaveSettings} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-50">
            <Save className="w-4 h-4" />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      )}

      {activeTab === 'integrations' && settings && (
        <div className="space-y-4">
          {/* GitHub */}
          <IntegrationCard
            name="GitHub"
            description="Stockage des articles et déploiement automatique"
            connected={settings.integrations.githubConnected}
            details={settings.integrations.githubConnected ? 'Repo: ProjectView/site-projectview' : 'Configurez GITHUB_TOKEN dans .env.local'}
          />
          {/* Netlify */}
          <IntegrationCard
            name="Netlify"
            description="Build et déploiement du site"
            connected={settings.integrations.netlifyConnected}
            details={settings.integrations.netlifyConnected ? 'Build hook configuré' : 'Configurez NETLIFY_BUILD_HOOK dans .env.local'}
          />
          {/* N8N */}
          <IntegrationCard
            name="N8N"
            description="Automatisation des workflows"
            connected={!!settings.integrations.n8nWebhook && !settings.integrations.n8nWebhook.includes('your-n8n')}
            details={settings.integrations.n8nWebhook && !settings.integrations.n8nWebhook.includes('your-n8n')
              ? 'Webhook connecté'
              : 'Configurez N8N_WEBHOOK_URL dans .env.local'}
          />
          {/* OpenAI */}
          <IntegrationCard
            name="OpenAI"
            description="Intelligence artificielle pour le chatbot visiteurs"
            connected={false}
            details="Configurez OPENAI_API_KEY dans .env.local"
          />
        </div>
      )}
    </div>
  );
}

// Reusable input field
function InputField({
  label,
  value,
  placeholder,
  icon: Icon,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 transition-colors"
      />
    </div>
  );
}

// Integration status card
function IntegrationCard({
  name,
  description,
  connected,
  details,
}: {
  name: string;
  description: string;
  connected: boolean;
  details: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          connected ? 'bg-green-500/15' : 'bg-white/[0.04]'
        }`}>
          <Plug className={`w-5 h-5 ${connected ? 'text-green-400' : 'text-ink-tertiary'}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-primary">{name}</p>
          <p className="text-xs text-ink-tertiary">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink-tertiary max-w-[200px] truncate hidden sm:block">
          {details}
        </span>
        {connected ? (
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-ink-tertiary flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
