import { db } from '@/lib/db';
import { LoginSchema } from '@/schemas/auth.schemas';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';

export const authConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        name: {},
        password: {},
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
          ? process.env.GITHUB_CLIENT_ID_PROD || ''
          : process.env.GITHUB_CLIENT_ID || '',
      clientSecret:
        process.env.NODE_ENV === 'production'
          ? process.env.GITHUB_CLIENT_SECRET_PROD || ''
          : process.env.GITHUB_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.email) return token;

      const existingUser = await db.user.findUnique({
        where: { email: token.email },
      });

      if (!existingUser) return token;

      // Add only the absolutely necesary data to encode in JWT
      token.role = existingUser.role;

      return token;
    },
  },
} satisfies NextAuthOptions;

export const getServerAuthSession = () => getServerSession(authConfig);
