import { z } from "zod";

export const shippingChargeValidationSchema = z.object({
  divisionId: z.number({
    required_error: "Division is required",
  }),

  shippingAmount: z.number({
    required_error: "shipping Amount is required",
  }),
  userId: z.number({
    required_error: "user is required",
  }),
  note: z.string().optional(),
  status: z.boolean().optional(),
});
