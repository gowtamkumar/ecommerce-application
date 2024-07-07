import { z } from "zod";

export const colorValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  color: z.string({
    required_error: "color is required",
  }),
  userId: z.number({
    required_error: "Name is required",
  }),
});
