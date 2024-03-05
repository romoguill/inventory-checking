import { z } from 'zod';

export enum PROVIDERS {
  GOOGLE = 'google',
}

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginSchema = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    email: z.string().email(),
    fullName: z.string().min(1, { message: 'Name is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    passwordConfirmed: z.string(),
  })
  .refine(({ password, passwordConfirmed }) => password === passwordConfirmed, {
    message: "Passwords don't match",
    path: ['passwordConfirmed'],
  });

export type RegisterSchema = z.infer<typeof RegisterSchema>;
