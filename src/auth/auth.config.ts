import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        return null;
      },
      credentials: {},
    }),
  ],
} satisfies AuthOptions;
