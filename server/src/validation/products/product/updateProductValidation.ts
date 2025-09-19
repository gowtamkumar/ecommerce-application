import { z } from 'zod';

export const updateProductValidationSchema = z.object({
  name: z.string({
    required_error: 'name is required',
  }),
  taxId: z.number({
    required_error: 'Tax is required',
  }),
  thumbnailImage: z.string({
    required_error: 'Thumbnail Image is required',
  }),
  hoverImage: z.string({
    required_error: 'Hover Image is required',
  }),
  images: z.array(
    z.string({
      required_error: 'Images is required',
    }),
  ),
  brandId: z.number().optional().nullable(),
  unitId: z.number({
    required_error: 'Unit is required',
  }),
  discountId: z.number().optional().nullable(),
  limitPurchaseQty: z.number().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  description: z.string({
    required_error: 'Description is required',
  }),
  shortDescription: z.string({
    required_error: 'Short Description is required',
  }),
  enableReview: z.boolean().optional(),
  variant: z.boolean().optional(),
  featured: z.boolean().optional(),
  alertQty: z.number({
    required_error: 'Alert Qty is Required',
  }),
  status: z.enum(['Active', 'Inactive']).optional(),

  productVariants: z
    .array(
      z.object({
        id: z.number().optional().nullable(),
        unitPrice: z.any({ required_error: 'Unit Price is required' }),
        purchasePrice: z.any({
          required_error: 'Purchase Price is required',
        }),
        colorId: z.number().optional(),
        material: z.string().optional().nullable(),
        sizeId: z.number().optional().nullable(),
        stockQty: z.number({
          required_error: 'Stock Qty is required',
        }),
      }),
    )
    .nonempty({ message: "can't be empty!" }),
  productCategories: z.array(z.number()).nonempty({ message: "can't be empty!" }),
});
