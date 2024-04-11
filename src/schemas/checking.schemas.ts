import { z } from 'zod';

export const RoundCheck = z.object({
  stock: z.number().min(0, 'Value must be positive'),
});

export type RoundCheck = z.infer<typeof RoundCheck>;
