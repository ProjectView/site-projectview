import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/lib/firebase-admin';
import { getAnalyticsSummary, getTodayStats } from '@/lib/firestore-analytics';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authError = await checkAdminSession(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const rangeParam = searchParams.get('range') || '30d';
  const rangeDays =
    rangeParam === '7d' ? 7 : rangeParam === '90d' ? 90 : 30;

  const [summary, today] = await Promise.all([
    getAnalyticsSummary(rangeDays),
    getTodayStats(),
  ]);

  return NextResponse.json({ ...summary, today });
}
