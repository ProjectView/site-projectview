'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Bot,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Chatbot', href: '/admin/chatbot', icon: Bot },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onSignOut: () => void;
  userName?: string;
  userEmail?: string;
  unreadMessages?: number;
}

export function AdminSidebar({ collapsed, onToggle, onSignOut, userName, userEmail, unreadMessages = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

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
              Admin
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
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
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
              {/* Active indicator */}
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
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!collapsed && item.label === 'Messages' && unreadMessages > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">
                  {unreadMessages}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/[0.06] p-3">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-ink-primary truncate">{userName || 'Admin'}</p>
            <p className="text-xs text-ink-tertiary truncate">{userEmail || ''}</p>
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
