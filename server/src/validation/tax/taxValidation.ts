import { z } from "zod";

export const taxValidationSchema = z.object({

  type: z.enum(["Percentage", "Fixed Amount"], {
    required_error: "Tax is Required",
  }),

  value: z.number({
    required_error: "Value is required",
  }),

  status: z.boolean().optional(),
});
