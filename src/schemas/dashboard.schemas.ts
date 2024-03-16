import { Prisma, Severity } from '@prisma/client';
import { z } from 'zod';

export const OrganizationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

export type OrganizationSchema = z.infer<typeof OrganizationSchema>;

export const ProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  imageUrl: z.string().optional(),
  batchTracking: z.boolean(),
  severity: z.enum([Severity.LOW, Severity.MEDIUM, Severity.HIGH]),
});

export type ProductSchema = z.infer<typeof ProductSchema>;
