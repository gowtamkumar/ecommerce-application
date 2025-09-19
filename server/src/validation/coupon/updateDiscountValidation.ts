import { z } from 'zod';

export const updateDiscountValidation = z.object({
  type: z.enum(['CouponCode', 'Discount'], {
    required_error: 'type is required',
  }),
  couponCode: z.string().nullable().optional(),
  discountType: z.enum(['Percentage', 'Fixed', 'FreeShipping'], {
    required_error: 'Discount Type is required',
  }),

  value: z.number({
    required_error: 'value is required',
  }),
  startDate: z.string().datetime().nullable().optional(),
  expiryDate: z.string().datetime().nullable().optional(),
  minOrderAmount: z.number().nullable().optional(),
  userId: z.number({
    required_error: 'user is required',
  }),
  maxUser: z.number().nullable().optional(),
  // usageCount: z.number({
  //   required_error: "usage Count is required",
  // }),

  // isSingleUse: z.boolean().optional(),

  status: z.enum(['Active', 'Inactive']).optional(),
});
