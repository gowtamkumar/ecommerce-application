import { z } from "zod";

export const updateShippingChargeValidationSchema = z.object({
  divisionId: z.number({
    required_error: "Division is required",
  }),

  shippingCharge: z.number({
    required_error: "shipping Amount is required",
  }),
  note: z.string().optional(),
  status: z.boolean().optional(),
});
