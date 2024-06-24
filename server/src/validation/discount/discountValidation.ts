import { z } from "zod";

export const discountValidationSchema = z.object({
  couponCode: z.string({
    required_error: "coupon Code is required",
  }),

  type: z.enum(["Percentage", "FixedAmount", "FreeShipping"], {
    required_error: "type is required",
  }),

  value: z.number({
    required_error: "value is required",
  }),

  startDate:z.string().datetime(),
  expiryDate: z.string().datetime(),

  minOrderAmount: z.number({
    required_error: "min Order Amount is required",
  }),

  maxUser: z.number().optional(),

  // usageCount: z.number({
  //   required_error: "usage Count is required",
  // }),

  // isSingleUse: z.boolean().optional(),

  status: z.enum(["Active", "Inactive"]).optional(),
});
