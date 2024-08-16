import { z } from "zod";

export const bannerValidationSchema = z.object({
  type: z.enum(["Slider"], {
    required_error: "type is required",
  }),
  name: z.string({
    required_error: "name is required",
  }),
  url: z.string().optional(),
  image: z.string({
    required_error: "User is required",
  }),
  userId: z.number({
    required_error: "User is required",
  }),
  description: z.string().optional(),
});
