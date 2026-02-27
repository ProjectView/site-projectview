'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

interface AdminShellProps {
  children: React.ReactNode;
}

interface UserInfo {
  email: string;
  name: string;
  uid: string;
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

  // Lire les infos utilisateur depuis le cookie
  useEffect(() => {
    setUserInfo(getUserInfo());
  }, []);

  // Fetch unread message count
  useEffect(() => {
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
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

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
