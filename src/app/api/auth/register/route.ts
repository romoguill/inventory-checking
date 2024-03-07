import { db } from '@/lib/db';
import { RegisterSchema } from '@/schemas/auth.schemas';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { sendEmail } from '@/lib/emails/sendEmail';
import VerificationEmail from '@/emails/VerificationEmail';

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

  if (existingUser)
    return NextResponse.json(
      {
        error: 'Email already in use. Please try another one',
      },
      { status: 409 }
    );

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

    const { data, error: emailError } = await sendEmail({
      to: [email],
      subject: 'Verify your email - Check Delta',
      content: VerificationEmail({ name, token: 'sdfa' }),
    });

    console.log(emailError);

    return NextResponse.json({ user: newUser }, { status: 200 });
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
