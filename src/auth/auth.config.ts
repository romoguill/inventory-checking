import { UserRole } from '@prisma/client';
import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import GitHubProvider, { GitHubProfile } from 'next-auth/providers/github';
import { db } from '@/lib/db';
import { z } from 'zod';
import { LoginSchema } from '@/schemas/auth.schemas';
import bcrypt from 'bcryptjs';

export const authConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        name: {
          label: 'Full Name',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'text',
        },
      },

      async authorize(credentials, req) {
        const parsedCredentials = LoginSchema.safeParse(credentials);

        // return {error: 'Invalid credentials'} as any; ## Nextjs don't want to support credentials specially with app router. If I return null, the library will throw an error, that can be handled but the response will be 200 which is wrong. Maybe replace NextAuth with other tools
        if (!parsedCredentials.success) return null;

        const dbUser = await db.user.findUnique({
          where: {
            email: parsedCredentials.data.email,
          },
        });

        if (!dbUser) return null;

        const passwordsMatch = bcrypt.compareSync(
          parsedCredentials.data.password,
          dbUser?.password || ''
        );

        if (!passwordsMatch) return null;

        return {
          id: dbUser?.id,
          email: dbUser?.email,
          name: dbUser?.name,
          image: dbUser?.image,
          role: dbUser.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
      profile(profile: GoogleProfile) {
        // Set fields for prisma adapter when creating user
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: UserRole.USER,
        };
      },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GitHubProvider({
      clientId:
        process.env.NODE_ENV === 'production'
          ? process.env.GITHUB_CLIENT_ID_PROD
          : process.env.GITHUB_CLIENT_ID || '',
      clientSecret:
        process.env.NODE_ENV === 'production'
          ? process.env.GITHUB_CLIENT_SECRET_PROD
          : process.env.GITHUB_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig;
