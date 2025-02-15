import { z } from "zod";

export const taxValidationSchema = z.object({

  name: z.string({
    required_error: "Name is required",
  }),

  userId: z.number({
    required_error: "User is required",
  }),
  
  value: z.number({
    required_error: "Value is required",
  }),

  status: z.enum(["Active", "Inactive"]).optional(),
});
