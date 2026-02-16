'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatConfig {
  enabled: boolean;
  welcomeMessage: string;
  position: 'bottom-right' | 'bottom-left';
  accentColor: string;
}

export function ChatWidget() {
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch chatbot config
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/chatbot');
        if (res.ok) {
          const data = await res.json();
          if (data.enabled) {
            setConfig(data);
          }
        }
      } catch {
        // Chatbot not available, don't show widget
      }
    }
    loadConfig();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  // Open chat with welcome message
  const handleOpen = useCallback(() => {
    setOpen(true);
    if (messages.length === 0 && config?.welcomeMessage) {
      setMessages([{ role: 'assistant', content: config.welcomeMessage }]);
    }
  }, [messages.length, config]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages
            .filter((m) => m.content !== config?.welcomeMessage || m.role === 'user')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Désolé, une erreur est survenue. Veuillez réessayer.' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Désolé, je ne suis pas disponible en ce moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if disabled
  if (!config?.enabled) return null;

  const isRight = config.position === 'bottom-right';
  const accent = config.accentColor || '#3B7A8C';

  return (
    <>
      {/* Chat window */}
      <div
        className={`fixed z-50 bottom-20 ${isRight ? 'right-4 sm:right-6' : 'left-4 sm:left-6'} transition-all duration-300 ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="w-[340px] sm:w-[380px] max-h-[500px] rounded-2xl bg-dark-surface/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between flex-shrink-0"
            style={{ backgroundColor: accent + '15' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accent + '25' }}
              >
                <Bot className="w-4 h-4" style={{ color: accent }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-primary">Assistant Projectview</p>
                <p className="text-[10px] text-ink-tertiary">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/[0.06] text-ink-tertiary hover:text-ink-primary transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[350px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'assistant' ? '' : 'bg-white/[0.08]'
                  }`}
                  style={msg.role === 'assistant' ? { backgroundColor: accent + '20' } : undefined}
                >
                  {msg.role === 'assistant' ? (
                    <Bot className="w-3 h-3" style={{ color: accent }} />
                  ) : (
                    <User className="w-3 h-3 text-ink-secondary" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-white/[0.08] text-ink-primary'
                      : 'text-ink-primary'
                  }`}
                  style={
                    msg.role === 'assistant'
                      ? { backgroundColor: accent + '10' }
                      : undefined
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: accent + '20' }}
                >
                  <Bot className="w-3 h-3" style={{ color: accent }} />
                </div>
                <div
                  className="px-3 py-2 rounded-xl flex items-center gap-1"
                  style={{ backgroundColor: accent + '10' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-ink-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-ink-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-ink-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/[0.06] flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Votre message..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-white/[0.15] transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-40"
                style={{ backgroundColor: accent }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* FAB button */}
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className={`fixed z-50 bottom-4 ${isRight ? 'right-4 sm:right-6' : 'left-4 sm:left-6'} w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}
        style={{ backgroundColor: accent }}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  );
}
