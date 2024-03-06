import { type UserRole } from '@prisma/client';
import 'next-auth';
import { type JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
  }
}
