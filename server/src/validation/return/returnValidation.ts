import { z } from 'zod';

export const returnValidationSchema = z.object({
  orderId: z.number({
    required_error: 'Order is required',
  }),
  orderItemId: z.number({
    required_error: 'Product is required',
  }),

  reason: z.string({
    required_error: 'Reason is required',
  }),

  phone: z.string({
    required_error: 'Phone is required',
  }),

  requestedQty: z.number({
    required_error: 'Requested Qty is required',
  }),

  userId: z.number({
    required_error: 'User is required',
  }),

  image: z.string().optional().nullable(),

  status: z.enum(['Requested', 'Approved', 'Rejected', 'Completed', 'Refunded']).optional(),
});
