import { z } from "zod";

export const discountValidationSchema = z.object({
  name: z.string({
    message: "name is required",
  }),

  discountStrategy: z.enum(["Percentage", "Fixed"], {
    message: "Discount Type is required",
  }),

  value: z.number({
    message: "value is required",
  }),


  status: z.enum(["Active", "Inactive"]).optional(),
});
