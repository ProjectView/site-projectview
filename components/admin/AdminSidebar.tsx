'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart2,
  FileText,
  MessageSquare,
  CalendarDays,
  Newspaper,
  Bot,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  Zap,
  Share2,
  Mic,
  Building2,
  Key,
  LayoutGrid,
  Download,
  ChevronDown,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';
import type { GlobalRole } from './AdminShell';

// ── Items PV internes (ops quotidiennes ProjectView) ────────────────────────
// Visibles uniquement pour les superadmins.
const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Réseaux Sociaux', href: '/admin/social', icon: Share2 },
  { label: 'Prospects', href: '/admin/leads', icon: Users },
  { label: 'Clients', href: '/admin/clients', icon: UserCheck },
  { label: 'Leadgen', href: '/admin/leadgen', icon: Zap },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Planning Éditorial', href: '/admin/editorial', icon: Newspaper },
  { label: 'Agenda', href: '/admin/agenda', icon: CalendarDays },
  { label: 'Chatbot', href: '/admin/chatbot', icon: Bot },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings },
];

// ── Admin utilisateurs (RBAC) — superadmin + admin_client ───────────────────
const usersItem = {
  label: 'Utilisateurs',
  href: '/admin/users',
  icon: ShieldCheck,
};

// ── Organisations (superadmin uniquement) ────────────────────────────────────
const orgsItem = {
  label: 'Organisations',
  href: '/admin/organisations',
  icon: Building2,
};

// ── Vue d'ensemble (superadmin uniquement) ────────────────────────────────────────────
const overviewItem = {
  label: "Vue d'ensemble",
  href: '/admin/overview',
  icon: Globe,
};

// ── Registre des sections SaaS ──────────────────────────────────────────────
// Chaque section est affichée si `enabledApps[slug]` est true pour l'user.
// Pour ajouter un nouveau SaaS : pousser une entrée ici.
interface AppSection {
  slug: string;
  label: string;
  icon: typeof Mic;
  items: { label: string; href: string; icon: typeof LayoutGrid }[];
}

const APP_SECTIONS: AppSection[] = [
  {
    slug: 'lucy',
    label: 'Lucy',
    icon: Mic,
    items: [
      { label: 'Dashboard', href: '/admin/lucy/dashboard', icon: LayoutGrid },
      { label: 'Clients', href: '/admin/lucy/clients', icon: Building2 },
      { label: 'Licences', href: '/admin/lucy/licenses', icon: Key },
      { label: 'Réunions', href: '/admin/lucy/meetings', icon: Mic },
      { label: 'Téléchargements', href: '/admin/lucy/downloads', icon: Download },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onSignOut: () => void;
  userName?: string;
  userEmail?: string;
  unreadMessages?: number;
  globalRole?: GlobalRole | null;
  enabledApps?: Record<string, boolean>;
}

export function AdminSidebar({
  collapsed,
  onToggle,
  onSignOut,
  userName,
  userEmail,
  unreadMessages = 0,
  globalRole = null,
  enabledApps = {},
}: AdminSidebarProps) {
  const pathname = usePathname();

  const isSuperadmin = globalRole === 'superadmin';
  const isAdminClient = globalRole === 'admin_client';

  // Sections à afficher : filtrées par enabledApps
  const visibleApps = APP_SECTIONS.filter((app) => enabledApps[app.slug] === true);

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-30 bg-dark-surface border-r border-white/[0.06] flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06]">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              Project<GradientText>view</GradientText>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-ink-tertiary bg-white/[0.06] px-1.5 py-0.5 rounded">
              {isSuperadmin ? 'Admin' : isAdminClient ? 'Admin client' : 'Espace'}
            </span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/[0.06] text-ink-secondary hover:text-ink-primary transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* ── PV internes : superadmin uniquement ─────────────────────── */}
        {isSuperadmin &&
          navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-white/[0.08] text-ink-primary'
                    : 'text-ink-secondary hover:bg-white/[0.04] hover:text-ink-primary'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-brand-teal to-brand-purple" />
                )}
                <div className="relative">
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-teal' : ''}`} />
                  {item.label === 'Messages' && unreadMessages > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </div>
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && item.label === 'Messages' && unreadMessages > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">
                    {unreadMessages}
                  </span>
                )}
              </Link>
            );
          })}

        {/* ── Utilisateurs (RBAC) : superadmin + admin_client ─────────── */}
        {(isSuperadmin || isAdminClient) && (
          <UsersNavItem
            item={usersItem}
            collapsed={collapsed}
            active={pathname.startsWith(usersItem.href)}
          />
        )}

        {/* ── Organisations (superadmin uniquement) ───────────────────── */}
        {isSuperadmin && (
          <Link
            href={orgsItem.href}
            title={collapsed ? orgsItem.label : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname.startsWith(orgsItem.href)
                ? 'bg-white/[0.08] text-ink-primary'
                : 'text-ink-secondary hover:bg-white/[0.05] hover:text-ink-primary'
            }`}
          >
            <orgsItem.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="flex-1">{orgsItem.label}</span>}
          </Link>
        )}

        {/* -- Vue d'ensemble (superadmin uniquement) ------------------------------------------ */}
        {isSuperadmin && (
          <Link
            href={overviewItem.href}
            title={collapsed ? overviewItem.label : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname.startsWith(overviewItem.href)
                ? 'bg-white/[0.08] text-ink-primary'
                : 'text-ink-secondary hover:bg-white/[0.05] hover:text-ink-primary'
            }`}
          >
            <overviewItem.icon className='w-4 h-4 flex-shrink-0' />
            {!collapsed && <span className='flex-1'>{overviewItem.label}</span>}
          </Link>
        )}

        {/* ── Sections SaaS dynamiques (filtrées par enabledApps) ─────── */}
        {visibleApps.map((app) => (
          <AppSectionBlock
            key={app.slug}
            app={app}
            collapsed={collapsed}
            pathname={pathname}
          />
        ))}

        {/* Empty state : aucune app activée (user_client en attente de provisioning) */}
        {visibleApps.length === 0 && !isSuperadmin && !isAdminClient && !collapsed && (
          <div className="px-3 py-4 text-xs text-ink-tertiary text-center">
            Aucune application activée.
            <br />
            Contactez votre administrateur.
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-white/[0.06] p-3">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-ink-primary truncate">{userName || 'Utilisateur'}</p>
            <p className="text-xs text-ink-tertiary truncate">{userEmail || ''}</p>
            {globalRole && (
              <p className="mt-1 text-[10px] uppercase tracking-widest text-ink-tertiary">
                {globalRole === 'superadmin' ? 'Superadmin' : globalRole === 'admin_client' ? 'Admin client' : 'Utilisateur'}
              </p>
            )}
          </div>
        )}
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-ink-secondary hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer"
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function UsersNavItem({
  item,
  collapsed,
  active,
}: {
  item: typeof usersItem;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
        active
          ? 'bg-white/[0.08] text-ink-primary'
          : 'text-ink-secondary hover:bg-white/[0.04] hover:text-ink-primary'
      }`}
      title={collapsed ? item.label : undefined}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-brand-teal to-brand-purple" />
      )}
      <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-brand-teal' : ''}`} />
      {!collapsed && <span className="flex-1">{item.label}</span>}
    </Link>
  );
}

function AppSectionBlock({
  app,
  collapsed,
  pathname,
}: {
  app: AppSection;
  collapsed: boolean;
  pathname: string;
}) {
  const sectionRoot = `/admin/${app.slug}`;
  const isActiveSection = pathname.startsWith(sectionRoot);
  const [open, setOpen] = useState(isActiveSection);

  return (
    <div className="pt-1">
      <button
        onClick={() => !collapsed && setOpen((o) => !o)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
          isActiveSection
            ? 'text-ink-primary'
            : 'text-ink-secondary hover:bg-white/[0.04] hover:text-ink-primary'
        }`}
        title={collapsed ? app.label : undefined}
      >
        {isActiveSection && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-brand-teal to-brand-purple" />
        )}
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
            isActiveSection
              ? 'bg-gradient-to-br from-brand-teal to-brand-purple'
              : 'bg-white/[0.06]'
          }`}
        >
          <app.icon className="w-3 h-3 text-white" />
        </div>
        {!collapsed && (
          <>
            <span className="flex-1 text-left font-semibold">{app.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {(open || collapsed) && (
        <div className={`${collapsed ? '' : 'pl-3 mt-0.5'} space-y-0.5`}>
          {app.items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 relative ${
                  isActive
                    ? 'bg-brand-teal/10 text-brand-teal font-medium'
                    : 'text-ink-tertiary hover:bg-white/[0.04] hover:text-ink-secondary'
                }`}
                title={collapsed ? `${app.label} — ${item.label}` : undefined}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand-teal' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
