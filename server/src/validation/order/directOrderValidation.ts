import { z } from 'zod';

export const directOrderValidationSchema = z.object({
  customerName: z
    .string({ required_error: 'Customer name is required' })
    .min(2, 'Name must be at least 2 characters'),
  phoneNo: z
    .string({ required_error: 'Phone number is required' })
    .min(10, 'Phone number must be at least 10 digits'),
  deliveryAddress: z
    .string({ required_error: 'Address is required' })
    .min(5, 'Delivery address must be at least 5 characters'),
  deliveryZone: z.string().optional(),
  shippingCharge: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val)),
  subTotal: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val)),
  grandTotal: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val)),
  paymentMethod: z.enum(['Cash', 'SSLCOMMERZ']).default('Cash'),
  note: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  orderItems: z
    .array(
      z.object({
        productId: z.number({ required_error: 'Product is required' }),
        productVariantId: z.number({ required_error: 'Product Variant is required' }),
        qty: z.number({ required_error: 'Quantity is required' }).min(1),
        unitPrice: z.union([z.number(), z.string()]).transform((val) => Number(val)),
        purchasePrice: z
          .union([z.number(), z.string()])
          .optional()
          .transform((val) => (val !== undefined ? Number(val) : 0)),
        discountedUnitPrice: z
          .union([z.number(), z.string()])
          .optional()
          .transform((val) => (val !== undefined ? Number(val) : undefined)),
        subTotal: z.union([z.number(), z.string()]).transform((val) => Number(val)),
        taxAmount: z
          .union([z.number(), z.string()])
          .optional()
          .transform((val) => (val !== undefined ? Number(val) : 0)),
      }),
    )
    .nonempty({ message: 'At least one item is required' }),
});

export type DirectOrderInput = z.infer<typeof directOrderValidationSchema>;
