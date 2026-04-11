import { z } from 'zod';

export const returnFullOrderValidationSchema = z.object({
  orderId: z.number({
    required_error: 'Order is required',
  }),

  reason: z.string({
    required_error: 'Reason is required',
  }),

  phone: z.string({
    required_error: 'Phone is required',
  }),

  userId: z.number({
    required_error: 'User is required',
  }),
  images: z.array(z.string()).optional().nullable(),
  comments: z.string().optional().nullable(),
});
