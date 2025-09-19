import { z } from 'zod';

export const orderStatusUpdateValidationSchema = z.object({
  status: z.enum(
    [
      'Pending',
      'Processing',
      'Shipped',
      'Approved',
      'Canceled',
      'Delivered',
      // "On Shipping",
      // "Returned",
    ],
    { required_error: 'Order Status is Required' },
  ),
  location: z.string().optional().nullable(),
  cancelResson: z.string().optional().nullable(),
});
