import { NextResponse } from 'next/server';

// POST /api/stripe/webhook — Webhooks Stripe
export async function POST(request: Request) {
  // TODO: Implémenter checkout.session.completed, invoice.paid, etc.
  return NextResponse.json({ received: true });
}
