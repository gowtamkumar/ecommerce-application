import { z } from "zod";

export const sizeValidationSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),

  status: z.boolean().optional(),
});
