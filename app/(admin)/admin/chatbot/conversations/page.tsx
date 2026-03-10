'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bot,
  User,
  MessageCircle,
  CalendarCheck,
  Trash2,
  Search,
  RefreshCw,
  Mail,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { Toast, ToastType } from '@/components/admin/Toast';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  messages: ConversationMessage[];
  visitorName?: string;
  visitorEmail?: string;
  appointmentId?: string;
  startedAt: string;
  lastMessageAt: string;
  messageCount: number;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function getVisitorLabel(conv: Conversation): string {
  return conv.visitorName || 'Visiteur anonyme';
}

function getPreview(conv: Conversation): string {
  const first = conv.messages.find((m) => m.role === 'user');
  return first ? first.content.slice(0, 80) + (first.content.length > 80 ? '…' : '') : '—';
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function fetchConversations() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConversations();
  }, []);

  // Auto-scroll when a conversation is selected
  useEffect(() => {
    if (selected) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [selected]);

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (c.visitorName ?? '').toLowerCase().includes(q) ||
      (c.visitorEmail ?? '').toLowerCase().includes(q) ||
      c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  });

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/conversations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (selected?.id === id) setSelected(null);
        setToast({ message: 'Conversation supprimée', type: 'success' });
      } else {
        setToast({ message: 'Erreur lors de la suppression', type: 'error' });
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] overflow-hidden">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/chatbot"
            className="flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Chatbot
          </Link>
          <span className="text-white/20">/</span>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-teal" />
            <h1 className="text-base font-semibold text-ink-primary">Conversations</h1>
          </div>
          {!loading && (
            <span className="text-xs text-ink-tertiary bg-white/[0.06] px-2 py-0.5 rounded-full">
              {conversations.length}
            </span>
          )}
        </div>
        <button
          onClick={fetchConversations}
          className="flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.04] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left panel — conversation list ── */}
        <div className="w-80 flex-shrink-0 border-r border-white/[0.06] flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-white/[0.06]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-tertiary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-white/[0.15] transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-ink-tertiary text-sm">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Chargement...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <MessageCircle className="w-8 h-8 text-ink-tertiary mb-3" />
                <p className="text-sm text-ink-secondary">
                  {search ? 'Aucun résultat' : 'Aucune conversation'}
                </p>
                {!search && (
                  <p className="text-xs text-ink-tertiary mt-1">
                    Les échanges avec le chatbot apparaîtront ici
                  </p>
                )}
              </div>
            ) : (
              filtered.map((conv) => {
                const isActive = selected?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelected(conv)}
                    className={`w-full text-left px-4 py-3.5 border-b border-white/[0.04] transition-colors group relative ${
                      isActive
                        ? 'bg-brand-teal/10 border-l-2 border-l-brand-teal'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-teal" />
                    )}

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-ink-primary truncate">
                        {getVisitorLabel(conv)}
                      </span>
                      <span className="text-[10px] text-ink-tertiary flex-shrink-0 mt-0.5">
                        {formatDate(conv.lastMessageAt)}
                      </span>
                    </div>

                    {conv.visitorEmail && (
                      <div className="flex items-center gap-1 mb-1">
                        <Mail className="w-3 h-3 text-ink-tertiary flex-shrink-0" />
                        <span className="text-xs text-ink-tertiary truncate">{conv.visitorEmail}</span>
                      </div>
                    )}

                    <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                      {getPreview(conv)}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-ink-tertiary flex items-center gap-1">
                        <MessageCircle className="w-2.5 h-2.5" />
                        {conv.messageCount} msg
                      </span>
                      {conv.appointmentId && (
                        <span className="text-[10px] text-green-400 flex items-center gap-1">
                          <CalendarCheck className="w-2.5 h-2.5" />
                          RDV
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right panel — conversation detail ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-dark-bg/30">
          {selected ? (
            <>
              {/* Conversation header */}
              <div className="flex-shrink-0 px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-teal/15 flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-primary">
                      {getVisitorLabel(selected)}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {selected.visitorEmail && (
                        <span className="text-xs text-ink-tertiary flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {selected.visitorEmail}
                        </span>
                      )}
                      <span className="text-xs text-ink-tertiary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(selected.startedAt)}
                      </span>
                      <span className="text-xs text-ink-tertiary">
                        {selected.messageCount} messages
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selected.appointmentId && (
                    <Link
                      href="/admin/agenda"
                      className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500/15 transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      RDV lié
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(selected.id)}
                    disabled={deleting === selected.id}
                    className="flex items-center gap-1.5 text-xs text-ink-secondary hover:text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Supprimer
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {selected.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 self-start mt-0.5 ${
                        msg.role === 'assistant'
                          ? 'bg-brand-teal/15'
                          : 'bg-white/[0.08]'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <Bot className="w-3.5 h-3.5 text-brand-teal" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-ink-secondary" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[70%] space-y-1 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-white/[0.08] text-ink-primary rounded-tr-sm'
                            : 'bg-brand-teal/10 text-ink-primary rounded-tl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.timestamp && (
                        <span className="text-[10px] text-ink-tertiary px-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-brand-teal" />
              </div>
              <p className="text-base font-medium text-ink-secondary mb-1">
                Sélectionnez une conversation
              </p>
              <p className="text-sm text-ink-tertiary max-w-xs">
                Choisissez une conversation dans la liste pour afficher l'échange complet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
