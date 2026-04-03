import { NextResponse } from 'next/server';

// POST /api/lucy/validate — Validation licence + fingerprint
export async function POST(request: Request) {
  // TODO: Implémenter la validation de licence
  // 1. Chercher la licence par key dans Firestore
  // 2. Vérifier status === active
  // 3. Vérifier fingerprint
  // 4. Vérifier expiresAt > now()
  return NextResponse.json({ valid: false, message: 'Not implemented' }, { status: 501 });
}
