import { z } from 'zod';

export const updateTaxValidationSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),

  value: z.number({
    required_error: 'Value is required',
  }),

  status: z.enum(['Active', 'Inactive']).optional(),
});
