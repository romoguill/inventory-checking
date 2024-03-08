import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import { authConfig } from './auth.config';
import { Adapter } from 'next-auth/adapters';

export const handlers = NextAuth({
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/error',
  },

  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: 'jwt' },
  ...authConfig,
});
