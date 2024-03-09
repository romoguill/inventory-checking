import { generateVerificationToken } from '@/auth/token-utils';
import { db } from '@/lib/db';
import { sendEmailVerification } from '@/lib/emails/sendEmail';
import { RegisterSchema } from '@/schemas/auth.schemas';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

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
  const existingUser = await db.user.findUnique({
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
      const verificationToken = await generateVerificationToken(email);

      await sendEmailVerification(
        existingUser.email,
        existingUser.name,
        verificationToken.token
      );

      return NextResponse.json(null, { status: 201 });
    }
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendEmailVerification(email, name, verificationToken.token);

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
