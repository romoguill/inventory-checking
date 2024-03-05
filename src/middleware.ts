import { auth } from '@/auth/auth';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { DEFAULT_REDIRECT, authRoutes } from './auth/routes';
import { RedirectType, redirect } from 'next/navigation';

export default auth((req) => {
  const { nextUrl, auth } = req;

  console.log(new URL(DEFAULT_REDIRECT, nextUrl.origin).href);

  if (auth) {
    if (authRoutes.includes(nextUrl.pathname))
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
