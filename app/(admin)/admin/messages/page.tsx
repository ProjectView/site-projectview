'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  Clock,
  Building2,
  Phone,
  ArrowLeft,
  RefreshCw,
  CircleDot,
} from 'lucide-react';
import type { Message } from '@/lib/messages';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Toast, ToastType } from '@/components/admin/Toast';

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function formatFullDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Fetch messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setUnreadCount(data.unreadCount);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Select a message
  const handleSelect = async (id: string) => {
    setSelectedId(id);
    const msg = messages.find((m) => m.id === id);
    if (msg) {
      setSelectedMessage(msg);

      // Mark as read
      if (!msg.read) {
        try {
          await fetch(`/api/admin/messages/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: true }),
          });
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, read: true } : m))
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
          // Silent fail
        }
      }
    }
  };

  // Delete message
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/messages/${deleteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erreur serveur');

      setToast({ message: 'Message supprimé.', type: 'success' });
      setDeleteId(null);

      if (selectedId === deleteId) {
        setSelectedId(null);
        setSelectedMessage(null);
      }

      fetchMessages();
    } catch {
      setToast({ message: 'Erreur lors de la suppression.', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer le message"
        message="Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible."
        confirmLabel="Supprimer"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="text-ink-secondary text-sm mt-1">
            {messages.length} message{messages.length > 1 ? 's' : ''}
            {unreadCount > 0 && (
              <span className="ml-2 text-brand-teal">
                ({unreadCount} non lu{unreadCount > 1 ? 's' : ''})
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all cursor-pointer disabled:opacity-50"
          title="Rafraîchir"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main content */}
      <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] overflow-hidden min-h-[500px]">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-white/20 border-t-brand-teal rounded-full animate-spin" />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-ink-tertiary">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-sm font-medium text-ink-secondary mb-1">Aucun message</p>
            <p className="text-xs text-ink-tertiary text-center max-w-xs">
              Les messages envoyés via le formulaire de contact apparaîtront ici.
            </p>
          </div>
        )}

        {!loading && messages.length > 0 && (
          <div className="flex h-[600px]">
            {/* Message list */}
            <div className={`${selectedMessage ? 'hidden md:block' : ''} w-full md:w-[380px] border-r border-white/[0.06] overflow-y-auto`}>
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg.id)}
                  className={`w-full text-left px-5 py-4 border-b border-white/[0.04] transition-colors cursor-pointer ${
                    selectedId === msg.id
                      ? 'bg-white/[0.06]'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread indicator */}
                    <div className="flex-shrink-0 mt-1.5">
                      {!msg.read ? (
                        <CircleDot className="w-3 h-3 text-brand-teal" />
                      ) : (
                        <div className="w-3 h-3" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-sm truncate ${!msg.read ? 'font-semibold text-ink-primary' : 'text-ink-secondary'}`}>
                          {msg.name}
                        </span>
                        <span className="text-[11px] text-ink-tertiary flex-shrink-0">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                      {msg.company && (
                        <p className="text-[11px] text-ink-tertiary truncate mb-0.5">{msg.company}</p>
                      )}
                      <p className="text-xs text-ink-tertiary line-clamp-2">{msg.message}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Message detail */}
            <div className={`${selectedMessage ? '' : 'hidden md:flex'} flex-1 overflow-y-auto`}>
              {!selectedMessage ? (
                <div className="flex flex-col items-center justify-center h-full text-ink-tertiary">
                  <MessageSquare className="w-10 h-10 opacity-20 mb-3" />
                  <p className="text-sm">Sélectionnez un message</p>
                </div>
              ) : (
                <div className="p-6">
                  {/* Mobile back button */}
                  <button
                    onClick={() => {
                      setSelectedId(null);
                      setSelectedMessage(null);
                    }}
                    className="md:hidden flex items-center gap-2 text-ink-secondary hover:text-ink-primary text-sm mb-4 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                  </button>

                  {/* Sender info */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-ink-primary">{selectedMessage.name}</h2>
                      <a href={`mailto:${selectedMessage.email}`} className="text-sm text-brand-teal hover:underline">
                        {selectedMessage.email}
                      </a>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-ink-tertiary">
                        {selectedMessage.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {selectedMessage.company}
                          </span>
                        )}
                        {selectedMessage.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {selectedMessage.phone}
                          </span>
                        )}
                        {selectedMessage.solution && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal">
                            {selectedMessage.solution}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteId(selectedMessage.id)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg text-ink-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-ink-tertiary mb-4">
                    <Clock className="w-3 h-3" />
                    {formatFullDate(selectedMessage.createdAt)}
                  </div>

                  {/* Message body */}
                  <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
                    <p className="text-sm text-ink-primary leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-3 mt-6">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: Contact Projectview`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-teal via-brand-purple to-brand-orange text-white hover:opacity-90 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      Répondre par email
                    </a>
                    <button
                      onClick={async () => {
                        const newRead = !selectedMessage.read;
                        try {
                          await fetch(`/api/admin/messages/${selectedMessage.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ read: newRead }),
                          });
                          setSelectedMessage({ ...selectedMessage, read: newRead });
                          setMessages((prev) =>
                            prev.map((m) =>
                              m.id === selectedMessage.id ? { ...m, read: newRead } : m
                            )
                          );
                          setUnreadCount((prev) =>
                            newRead ? Math.max(0, prev - 1) : prev + 1
                          );
                        } catch {
                          // Silent fail
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/[0.04] border border-white/[0.08] text-ink-secondary hover:bg-white/[0.08] hover:text-ink-primary transition-all cursor-pointer"
                    >
                      {selectedMessage.read ? (
                        <>
                          <MailOpen className="w-4 h-4" />
                          Marquer non lu
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Marquer lu
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
