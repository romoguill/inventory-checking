import { z } from 'zod';

export const RoundCheck = z.object({
  roundResults: z.array(
    z.object({
      stock: z.coerce
        .number({ invalid_type_error: 'Must be a number' })
        .min(0, 'Value must be positive'),
    })
  ),
});

export type RoundCheck = z.infer<typeof RoundCheck>;
