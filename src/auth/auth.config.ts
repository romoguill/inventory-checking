import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        return null;
      },
      credentials: {},
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_ID || '',
      clientSecret: process.env.GOOGLE_AUTH_SECRET || '',
    }),
  ],
} satisfies AuthOptions;
