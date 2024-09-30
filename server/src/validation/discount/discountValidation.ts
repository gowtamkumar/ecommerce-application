import { z } from "zod";

const conditionalSchema = z.object({
  type: z.enum(["CouponCode", "Discount"], {
    required_error: "type is required",
  }),
  couponCode: z.string().nullable().optional(),
  discountType: z.enum(["Percentage", "FixedAmount", "FreeShipping"], {
    required_error: "Discount Type is required",
  }),

  value: z.number({
    required_error: "value is required",
  }),
  startDate: z.string().datetime().nullable().optional(),
  expiryDate: z.string().datetime().nullable().optional(),
  minOrderAmount: z.number().nullable().optional(),
  userId: z.number({
    required_error: "user is required",
  }),
  maxUser: z.number().nullable().optional(),
  // usageCount: z.number({
  //   required_error: "usage Count is required",
  // }),

  // isSingleUse: z.boolean().optional(),

  status: z.enum(["Active", "Inactive"]).optional(),
});

export const discountValidationSchema = conditionalSchema
  .superRefine((data, ctx) => {
    if (data.type === "CouponCode" && !data.couponCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'couponCode is required when role is "admin"',
        path: ["couponCode"],
      });
    }

    if (data.type === "CouponCode" && !data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start Date is required",
        path: ["startDate"],
      });
    }

    if (data.type === "CouponCode" && !data.expiryDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Expiry Date Date is required",
        path: ["expiryDate"],
      });
    }

    if (data.type === "CouponCode" && !data.minOrderAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Min Order Amount Date is required",
        path: ["minOrderAmount"],
      });
    }
  })
  .transform((trans) => {
    if (trans.type === "Discount") {
      trans.couponCode = null;
      trans.startDate = null;
      trans.expiryDate = null;
      trans.minOrderAmount = null;
      trans.maxUser = null;
    }
    return trans;
  });
