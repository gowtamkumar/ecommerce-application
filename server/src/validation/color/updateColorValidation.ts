import { z } from "zod";

export const updateColorValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  color: z.string({
    required_error: "color is required",
  }),
});
