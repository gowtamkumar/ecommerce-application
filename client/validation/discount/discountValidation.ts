import { z } from "zod";

export const discountValidationSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),

  discountStrategy: z.enum(["Percentage", "Fixed"], {
    required_error: "Discount Type is required",
  }),

  value: z.number({
    required_error: "value is required",
  }),


  status: z.enum(["Active", "Inactive"]).optional(),
});
