import { z } from 'zod';

export const orderUpdateValidationSchema = z.object({
  subTotal: z.number({
    required_error: 'order total Amount is Required',
  }),
  discountAmount: z.number().optional(),
  shippingCharge: z.number().optional(),
  tax: z.number().optional(),
  note: z.string().optional(),
  phoneNo: z.string({
    required_error: 'Phone no is Required',
  }),
  email: z.string().optional(),
  paymentStatus: z.enum(['Paid', 'Not Paid', 'PertialPaid'], {
    required_error: 'Payment Status is required',
  }),

  paymentMothod: z.enum(['Oneline', 'Offline']).optional(),
  status: z.enum(['Processing', 'Pending', 'Completed', 'Failed']).optional(),
  orderItems: z
    .array(
      z.object({
        unitPrice: z.string({ required_error: 'Price is required' }),
        tax: z.string({ required_error: 'Tax is required' }),
        discount: z.string({ required_error: 'Discount is required' }),
        productId: z.number({ required_error: 'Product is required' }),
        qty: z.number({ required_error: 'qty is required' }),
      }),
    )
    .nonempty({ message: "can't be empty!" }),
});
