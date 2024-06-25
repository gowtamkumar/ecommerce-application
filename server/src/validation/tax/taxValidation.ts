import { z } from "zod";

export const taxValidationSchema = z.object({

  name: z.string({
    required_error: "Name is required",
  }),

  type: z.enum(["Percentage", "FixedAmount"], {
    required_error: "Type is Required",
  }),

  value: z.number({
    required_error: "Value is required",
  }),

  status: z.enum(["Active", "Inactive"]).optional(),
});
