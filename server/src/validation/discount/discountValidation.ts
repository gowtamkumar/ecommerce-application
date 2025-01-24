import { z } from "zod";

export const discountValidation = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  discountType: z.enum(["Percentage", "Fixed"], {
    required_error: "Discount Type is required",
  }),

  value: z.number({
    required_error: "value is required",
  }),

  userId: z.number({
    required_error: "user is required",
  }),

  status: z.enum(["Active", "Inactive"]),
});
