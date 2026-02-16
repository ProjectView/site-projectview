import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Connexion — Projectview Admin',
};

// Login page gets its own layout WITHOUT the AdminShell (no sidebar/topbar)
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider basePath="/api/admin/auth">
      {children}
    </SessionProvider>
  );
}
