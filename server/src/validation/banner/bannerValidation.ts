import { z } from "zod";

export const bannerValidationSchema = z.object({
  type: z.enum(["Slider", "Middle", "Left", "Right", "Footer"], {
    required_error: "type is required",
  }),
  title: z.string({
    required_error: "title is required",
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
