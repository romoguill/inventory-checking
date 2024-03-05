import { auth } from '@/auth/auth';
import { NextResponse } from 'next/server';
import { DEFAULT_REDIRECT, authRoutes, privateRoutes } from './auth/routes';

export default auth((req) => {
  const { nextUrl, auth } = req;

  // Redirection for pages routes based on session and endpoint
  if (auth) {
    if (authRoutes.includes(nextUrl.pathname)) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl.origin));
    }
  } else {
    if (privateRoutes.includes(nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/auth/login', nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
