import { UserRole } from '@prisma/client';
import { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import GitHubProvider, { GitHubProfile } from 'next-auth/providers/github';

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
        console.log(credentials);
        return null;
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
