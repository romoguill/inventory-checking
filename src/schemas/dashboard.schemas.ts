import { Prisma, Severity } from '@prisma/client';
import { z } from 'zod';

export const OrganizationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

export type OrganizationSchema = z.infer<typeof OrganizationSchema>;

export const ProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  currentStock: z.coerce.number(),
  imageUrl: z.string().optional(),
  batchTracking: z.boolean(),
  severity: z.enum([Severity.LOW, Severity.MEDIUM, Severity.HIGH], {
    errorMap: (issue, ctx) => ({
      message: 'Severity must be either Low, Medium or High',
    }),
  }),
});

export type ProductSchema = z.infer<typeof ProductSchema>;

Prisma.PolicyScalarFieldEnum;

export const PolicySchema = z.object({
  threshold: z.coerce.number(),
  frequency: z.coerce.number(),
});

export type PolicySchema = z.infer<typeof PolicySchema>;
