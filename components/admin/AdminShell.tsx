'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

interface AdminShellProps {
  children: React.ReactNode;
}

export type GlobalRole = 'superadmin' | 'admin_client' | 'user_client';

interface UserInfo {
  email: string;
  name: string;
  uid: string;
  orgId?: string | null;
  globalRole?: GlobalRole | null;
  enabledApps?: Record<string, boolean>;
  appRoles?: Record<string, string>;
}

function getUserInfo(): UserInfo | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(/(?:^|;\s*)__user_info=([^;]*)/);
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function AdminShell({ children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  // Lire les infos utilisateur depuis le cookie (inclut RBAC : globalRole, enabledApps…)
  useEffect(() => {
    setUserInfo(getUserInfo());
  }, []);

  // Vérifier la session Firebase au montage — si expirée, rediriger vers login
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/session');
        if (res.status === 401) {
          router.replace('/admin/login');
        }
      } catch {
        // Silent
      }
    }
    checkSession();
  }, [router]);

  // Fetch unread message count — superadmin only (les autres rôles n'ont pas accès aux messages PV)
  useEffect(() => {
    if (userInfo && userInfo.globalRole && userInfo.globalRole !== 'superadmin') return;
    async function fetchUnread() {
      try {
        const res = await fetch('/api/admin/messages');
        if (res.ok) {
          const data = await res.json();
          setUnreadMessages(data.unreadCount || 0);
        }
      } catch {
        // Silent
      }
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [userInfo]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/session', { method: 'DELETE' });
    } catch {
      // Silent
    }
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onSignOut={handleSignOut}
        userName={userInfo?.name || undefined}
        userEmail={userInfo?.email || undefined}
        unreadMessages={unreadMessages}
        globalRole={userInfo?.globalRole ?? null}
        enabledApps={userInfo?.enabledApps ?? {}}
      />
      <AdminTopbar
        sidebarCollapsed={collapsed}
        onMenuClick={() => setCollapsed(!collapsed)}
      />
      <main
        className={`transition-all duration-300 p-6 ${
          collapsed ? 'ml-[68px]' : 'ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
