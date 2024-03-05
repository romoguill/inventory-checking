import { UserRole } from '@prisma/client';
import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

export const authConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile: GoogleProfile) {
        // Set fields for prisma adapter when creating user
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: UserRole.USER,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
