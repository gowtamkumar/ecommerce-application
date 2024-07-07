import { z } from "zod";

export const unitValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  userId: z.number({
    required_error: "Name is required",
  }),
});
