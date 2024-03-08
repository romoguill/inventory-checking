import { auth } from '@/auth/auth';
import { NextResponse } from 'next/server';
import { DEFAULT_REDIRECT, authRoutes, privateRoutes } from './auth/routes';

export default auth((req) => {
  const { nextUrl, auth } = req;

  console.log(nextUrl);
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

  // Override redirection of NextAuth. Library is just updating to v5. The default is to redirect to /auth/api/login + error codes if it fails. I want to redirect to my custom page form

  // if (nextUrl.pathname === 'auth/login' && nextUrl.)

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
