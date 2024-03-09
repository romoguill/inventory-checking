import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const getVerificationToken = async (email: string) => {
  return db.verificationToken.findFirst({
    where: {
      email,
    },
  });
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // token will last 1 hour

  const dbVerificationToken = await getVerificationToken(email);

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
