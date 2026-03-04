import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getLeadById, addNote } from '@/lib/firestore-leads';
import { getSequenceById, createRun } from '@/lib/firestore-sequences';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/admin/sequences/assign
// Body: { sequenceId: string, leadIds: string[] }
export async function POST(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { sequenceId, leadIds } = body;

    if (!sequenceId || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { error: 'sequenceId et leadIds[] sont requis.' },
        { status: 400 }
      );
    }

    // Récupérer la séquence
    const sequence = await getSequenceById(sequenceId);
    if (!sequence) {
      return NextResponse.json({ error: 'Séquence introuvable.' }, { status: 404 });
    }

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    const results: { leadId: string; status: 'envoyé' | 'erreur'; error?: string }[] = [];

    for (const leadId of leadIds) {
      const lead = await getLeadById(leadId);
      if (!lead) {
        results.push({ leadId, status: 'erreur', error: 'Lead introuvable' });
        continue;
      }

      let runStatus: 'envoyé' | 'erreur' = 'envoyé';
      let errorMessage: string | undefined;

      // Envoyer le webhook N8N si configuré
      if (n8nUrl && !n8nUrl.includes('your-n8n')) {
        try {
          const webhookRes = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'sequence_assigned',
              lead: {
                id: lead.id,
                firstName: lead.firstName,
                lastName: lead.lastName,
                email: lead.email,
                company: lead.company,
                phone: lead.phone ?? '',
              },
              sequence: {
                id: sequence.id,
                name: sequence.name,
                emails: sequence.emails,
              },
            }),
          });
          if (!webhookRes.ok) {
            runStatus = 'erreur';
            errorMessage = `N8N a répondu ${webhookRes.status}`;
          }
        } catch (err) {
          runStatus = 'erreur';
          errorMessage = err instanceof Error ? err.message : 'Erreur webhook';
        }
      }

      // Créer le run dans Firestore
      await createRun({
        sequenceId: sequence.id,
        sequenceName: sequence.name,
        leadId: lead.id,
        leadName: `${lead.firstName} ${lead.lastName}`.trim(),
        leadEmail: lead.email,
        leadCompany: lead.company,
        status: runStatus,
        sentToN8nAt: new Date().toISOString(),
        ...(errorMessage ? { errorMessage } : {}),
      });

      // Ajouter une note sur le lead
      await addNote(lead.id, {
        type: 'relance',
        content: runStatus === 'envoyé'
          ? `Séquence "${sequence.name}" lancée via Leadgen (${sequence.emails.length} email${sequence.emails.length > 1 ? 's' : ''})`
          : `Tentative de lancement séquence "${sequence.name}" — erreur : ${errorMessage}`,
        author: 'Admin',
      });

      results.push({ leadId, status: runStatus, ...(errorMessage ? { error: errorMessage } : {}) });
    }

    const sent = results.filter((r) => r.status === 'envoyé').length;
    const failed = results.filter((r) => r.status === 'erreur').length;

    return NextResponse.json({ results, sent, failed });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
