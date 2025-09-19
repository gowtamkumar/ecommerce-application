import { z } from 'zod';

export const onlineCreateOrderValidationSchema = z.object({
  totalQty: z.number({
    required_error: 'Total Qty is Required',
  }),
  subTotal: z.string({
    required_error: 'Subtotal is Required',
  }),

  userId: z.number({
    required_error: 'User is Required',
  }),
  couponId: z.union([z.number(), z.null()]).optional(),
  totalItemsDiscount: z.string().optional(),
  couponDiscount: z.string().optional(),
  shippingCharge: z.string({
    required_error: 'Shipping Charge is Required',
  }),
  totalTax: z.string().optional(),
  grandTotal: z.string({
    required_error: 'Grand Total is Required',
  }),
  shippingAddressId: z.number({
    required_error: 'Shipping Address is Required',
  }),
  paymentMethod: z.enum(['Cash', 'SSLCOMMERZ', 'Stripe'], {
    required_error: 'Payment Method is Required',
  }),
  note: z.string().optional(),
  orderItems: z
    .array(
      z.object({
        qty: z.number({ required_error: 'qty is required' }),
        productVariantId: z.number({
          required_error: 'Product Variant is required',
        }),
        productId: z.number({ required_error: 'Product is required' }),
        unitPrice: z.string({ required_error: 'Unit Price is required' }),
        purchasePrice: z.string({
          required_error: 'Purchase Price is required',
        }),
        discountedUnitPrice: z.string().optional(),
        totalDiscountedPrice: z.string().optional(),
        discountAmountPerUnit: z.string().optional(),
        totalDiscountAmount: z.string().optional(),
        subTotal: z.string({
          required_error: 'SubTotal is required',
        }),
        taxAmount: z.string({ required_error: 'Tax Amount is required' }),
      }),
    )
    .nonempty({ message: "can't be empty!" }),
});
