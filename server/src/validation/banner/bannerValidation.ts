import { z } from "zod";

export const bannerValidationSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
  image: z.string({
    required_error: "User is required",
  }),
  userId: z.number({
    required_error: "User is required",
  }),
  description: z.string().optional(),
});
