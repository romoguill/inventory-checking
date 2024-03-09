import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { getServerSession } from 'next-auth';
import { authConfig } from './auth.config';
import { Adapter } from 'next-auth/adapters';

export const handlers = NextAuth({
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
    error: '/auth/error',
  },

  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: 'jwt' },
  ...authConfig,
});
