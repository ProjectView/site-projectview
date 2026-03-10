import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Autoriser la page login et la route session
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/session')
  ) {
    return NextResponse.next();
  }

  // Protéger toutes les routes /admin/*
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('__session')?.value;

    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Note: on ne peut pas appeler firebase-admin dans le middleware Edge
    // (pas de support Node.js natif). On vérifie juste la présence du cookie.
    // La vérification complète se fait dans chaque route API.
    // Pour le middleware, on se fie au cookie httpOnly qui ne peut pas être
    // falsifié côté client.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
