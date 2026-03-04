import type { Metadata } from 'next';
import { LeadgenContent } from './LeadgenContent';

export const metadata: Metadata = {
  title: 'Leadgen — Admin Projectview',
};

export default function LeadgenPage() {
  return <LeadgenContent />;
}
