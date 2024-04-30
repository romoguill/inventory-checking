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
  threshold: z.coerce
    .number()
    .min(0, { message: 'Threshold must be between 0% and 100%' })
    .max(100, { message: 'Threshold must be between 0% and 100%' }),
  frequency: z.coerce
    .number()
    .min(1, { message: 'Frequency must be at least 1 day' }),
});

export type PolicySchema = z.infer<typeof PolicySchema>;

export const MemberSchema = z.object({
  email: z.string().email(),
});

export type MemberSchema = z.infer<typeof MemberSchema>;

export const ReconciliationSchema = z.object({
  reconciliation: z.array(
    z.object({
      method: z.enum(['ORIGINAL', 'REVIEW', 'AVERAGE']),
    })
  ),
});

export type ReconciliationSchema = z.infer<typeof ReconciliationSchema>;
