import { z } from 'zod';

export const shippingChargeValidationSchema = z.object({
  districtId: z.number({
    required_error: 'District is required',
  }),

  shippingCharge: z.number({
    required_error: 'shipping Amount is required',
  }),
  userId: z.number({
    required_error: 'user is required',
  }),
  note: z.string().optional(),
  status: z.boolean().optional(),
});
