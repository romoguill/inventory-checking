import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { NextAuthConfig } from 'next-auth';
import { authConfig } from './auth.config';
import { UserRole } from '@prisma/client';

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      console.log({ user });
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
    error: '/auth/error',
  },

  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
