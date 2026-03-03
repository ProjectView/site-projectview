'use client';

import { useParams } from 'next/navigation';
import { LeadDetailView } from '@/components/admin/LeadDetailView';

export default function ClientDetailPage() {
  const params = useParams();
  const id = params.id as string;
  return <LeadDetailView id={id} mode="client" />;
}
