import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { getServerAuthSession } from './auth.config';

export const getUserByEmail = async (email: string) => {
  return db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      role: true,
    },
  });
};

export const getUserById = async (id: string) => {
  return db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      role: true,
    },
  });
};

export const getVerificationTokenByEmail = async (email: string) => {
  return db.verificationToken.findFirst({
    where: {
      email,
    },
  });
};

export const getVerificationTokenByToken = async (token: string) => {
  return db.verificationToken.findUnique({
    where: {
      token,
    },
  });
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // token will last 1 hour

  // No need to store old tokens. Delete the old one linked to that email
  const dbVerificationToken = await getVerificationTokenByEmail(email);

  if (dbVerificationToken) {
    await db.verificationToken.delete({
      where: {
        token: dbVerificationToken.token,
      },
    });
  }

  return db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
};

export const validateVerificationToken = async (
  token: string
): Promise<{ error: 'invalid' | 'expired' | null }> => {
  console.log({ token });
  const dbVerificationToken = await getVerificationTokenByToken(token);

  console.log({ dbVerificationToken });

  if (!dbVerificationToken) return { error: 'invalid' };

  if (dbVerificationToken.expires < new Date()) return { error: 'expired' };

  const dbUser = await getUserByEmail(dbVerificationToken.email);

  console.log({ dbUser });

  if (!dbUser || dbVerificationToken.email !== dbUser.email)
    return { error: 'invalid' };

  return { error: null };
};
