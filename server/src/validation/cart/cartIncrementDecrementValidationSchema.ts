import { z } from 'zod';

export const cartIncrementDecrementValidationSchema = z.object({
  type: z.enum(['Increment', 'Decrement']),
  qty: z.number({ required_error: 'Qty is required' }),
});
