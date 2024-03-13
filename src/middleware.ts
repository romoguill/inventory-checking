import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import {
  DEFAULT_REDIRECT,
  authRoutes,
  privateRoutes,
  publicRoutes,
} from './auth/routes';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { JWT, getToken } from 'next-auth/jwt';

type WithAuth = {
  nextauth?: {
    token: JWT | null;
  };
};

export async function middleware(req: NextRequest & WithAuth) {
  const { nextUrl } = req;

  // Check if route is public. Middleware will not affect this ones
  if (publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
  });

  // If logged in and tries to acces /login or /register, redirect them to app
  if (token && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT, nextUrl.origin));
  }

  if (!token && privateRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl.origin));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
