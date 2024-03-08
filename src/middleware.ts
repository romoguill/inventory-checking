import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_REDIRECT, authRoutes, privateRoutes } from './auth/routes';

export function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Redirection for pages routes based on session and endpoint
  if (false) {
    if (authRoutes.includes(nextUrl.pathname)) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl.origin));
    }
  } else {
    if (privateRoutes.includes(nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/auth/login', nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
