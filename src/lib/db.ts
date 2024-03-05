import { PrismaClient } from '@prisma/client';
import { DatabaseBackup } from 'lucide-react';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.POSTGRES_URL,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

console.log(globalForPrisma.prisma);
