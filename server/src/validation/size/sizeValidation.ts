import { z } from "zod";

export const sizeValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  userId: z.number({
    required_error: "Name is required",
  }),

  status: z.boolean().optional(),
});
