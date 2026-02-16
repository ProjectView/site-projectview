import { SessionProvider } from 'next-auth/react';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Admin — Projectview',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider basePath="/api/admin/auth">
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
