'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

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
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onSignOut={handleSignOut}
        userName={session?.user?.name || undefined}
        userEmail={session?.user?.email || undefined}
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
