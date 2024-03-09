'use server';

import { generateVerificationToken } from '@/auth/token-utils';
import { db } from '@/lib/db';
import { sendEmailVerification } from '@/lib/emails/sendEmail';

export const generateEmailVerification = async (
  email: string,
  name: string | null
) => {
  const verificationToken = await generateVerificationToken(email);

  await sendEmailVerification(email, name, verificationToken.token);
};

export const verifyEmail = async (email: string) => {
  const user = await db.user.update({
    data: {
      emailVerified: new Date(),
    },
    where: {
      email,
    },
  });

  console.log(user);
};
