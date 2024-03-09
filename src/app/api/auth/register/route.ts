import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas/auth.schemas';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { sendEmail } from '@/lib/emails/sendEmail';
import VerificationEmail from '@/emails/VerificationEmail';
import { generateVerificationToken } from '@/auth/token-utils';

export async function POST(req: NextRequest) {
  const payload = await req.json();

  const parsed = RegisterSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid fields',
        issues: parsed.error.issues,
      },
      { status: 400 }
    );
  }

  const { email, name, password } = parsed.data;

  // Check if user exists with that email
  const existingUser = await db.user.findFirst({
    where: {
      email,
    },
  });

  // There could be a problem with email verification. So if the user is in db BUT email was not verified,
  //    im not sending an error, but resending mail. DONT KNOW IF THIS IS BEST PRACTICE

  if (existingUser) {
    if (existingUser.emailVerified) {
      return NextResponse.json(
        {
          error: 'Email already in use. Please try another one',
        },
        { status: 409 }
      );
    } else {
      await sendEmail({
        to: [email],
        subject: 'Verify your email - Check Delta',
        content: VerificationEmail({ name, token: 'sdfa' }),
      });
      return NextResponse.json(null, { status: 201 });
    }
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    const verificationToken = await generateVerificationToken(email);

    const { data, error: emailError } = await sendEmail({
      to: [email],
      subject: 'Verify your email - Check Delta',
      content: VerificationEmail({ name, token: verificationToken.token }),
    });

    console.log(emailError);

    return NextResponse.json(null, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: 'Something went wrong with the registration process',
      },
      { status: 500 }
    );
  }
}
