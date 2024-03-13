import { z } from 'zod';

export const OrganizationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
});

export type OrganizationSchema = z.infer<typeof OrganizationSchema>;
