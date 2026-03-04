import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── Domain guesser ────────────────────────────────────────────────────────

function guessDomain(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(sas|sarl|sasu|sa|snc|eurl|sci|ei|sca|gie|inc|ltd|gmbh|groupe|group|france|solutions?|services?|consulting|conseil|holding|invest)\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) + '.fr';
}

// ── GET /api/admin/leadgen/sirene ─────────────────────────────────────────

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const page = parseInt(searchParams.get('page') ?? '1', 10) || 1;

  if (!q) {
    return NextResponse.json({ error: 'Paramètre q requis' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      q,
      page: String(page),
      per_page: '20',
      etat_administratif: 'A', // entreprises actives uniquement
    });

    const res = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?${params}`,
      {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `SIRENE API erreur ${res.status}: ${text.slice(0, 200)}` },
        { status: 502 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();
    const results: unknown[] = Array.isArray(data.results) ? data.results : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const companies = results.map((r: any) => {
      const siege = r.siege ?? {};
      const effectifCode: string = r.tranche_effectif_salarie ?? siege.tranche_effectif_salarie ?? '';
      return {
        siret: siege.siret ?? r.siren ?? '',
        name: (r.nom_complet ?? r.nom_raison_sociale ?? '').trim(),
        sector: r.libelle_activite_principale ?? '',
        city: (siege.libelle_commune ?? '').toUpperCase(),
        postalCode: siege.code_postal ?? '',
        employees: EFFECTIF_LABELS[effectifCode] ?? effectifCode,
        guessDomain: guessDomain(r.nom_raison_sociale ?? r.nom_complet ?? ''),
      };
    });

    return NextResponse.json({
      companies,
      total: data.total_results ?? 0,
      page: data.page ?? page,
      totalPages: data.total_pages ?? 1,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

const EFFECTIF_LABELS: Record<string, string> = {
  '00': '0 salarié',
  '01': '1-2',
  '02': '3-5',
  '03': '6-9',
  '11': '10-19',
  '12': '20-49',
  '21': '50-99',
  '22': '100-199',
  '31': '200-249',
  '32': '250-499',
  '41': '500-999',
  '42': '1 000-1 999',
  '51': '2 000-4 999',
  '52': '5 000-9 999',
  '53': '10 000+',
};
