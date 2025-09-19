import { z } from 'zod';

export const createMembershipValidationSchema = z.object({
  name: z.string({
    // Silver, Gold, Prime
    required_error: 'name is required',
  }),
  fee: z.number().nullable().optional(),
  durationDays: z.number({
    // Silver, Gold, Prime
    required_error: 'Duration Days is required',
  }),
  discountPercentage: z.number({
    // Silver, Gold, Prime
    required_error: 'Discount Percentage is required',
  }),
  bonusPointsMultiplier: z.number({
    // Silver, Gold, Prime
    required_error: 'bonus Points Multiplier is required',
  }),
  freeShipping: z.boolean({
    // Silver, Gold, Prime
    required_error: 'Free Shipping is required',
  }),

  active: z.boolean().optional(),
});
