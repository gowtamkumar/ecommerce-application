import { z } from 'zod';

export const updateShippingChargeValidationSchema = z.object({
  districtId: z.number({
    required_error: 'District is required',
  }),

  shippingCharge: z.number({
    required_error: 'shipping Amount is required',
  }),
  note: z.string().nullable().optional(),
  status: z.boolean().optional(),
});
