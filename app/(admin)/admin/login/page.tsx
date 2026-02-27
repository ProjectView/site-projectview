'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getClientAuth } from '@/lib/firebase-client';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { GradientText } from '@/components/ui/GradientText';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Obtenir l'instance auth au moment du submit (lazy, côté client uniquement)
      const auth = getClientAuth();
      if (!auth) {
        setError('Configuration Firebase manquante. Contactez l\'administrateur.');
        return;
      }

      // 1. Connexion Firebase côté client
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Envoi du token au serveur pour créer le cookie de session
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Erreur lors de la création de session.');
        return;
      }

      // 3. Redirection vers le dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-email'
      ) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
        console.error('Login error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 hero-mesh opacity-60" />
      <div className="absolute inset-0 bg-dark-bg/40" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Project<GradientText>view</GradientText>
            </h1>
            <p className="text-ink-secondary text-sm">Back Office</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@projectview.fr"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-ink-secondary uppercase tracking-wider mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-tertiary" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-10 pr-4 py-3 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-brand-teal/50 focus:ring-1 focus:ring-brand-teal/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold bg-gradient-to-r from-brand-teal via-brand-green to-brand-orange text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-tertiary mt-6">
          Projectview &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
