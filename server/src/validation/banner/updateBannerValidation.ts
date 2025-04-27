import { z } from "zod";

export const updateBannerValidationSchema = z.object({
  type: z.enum(["Slider", "Banner", "Slider Right","Footer"], {
    required_error: "type is required",
  }),
  title: z.string({
    required_error: "title is required",
  }),
  url: z.string().nullable(),
  image: z.string({
    required_error: "User is required",
  }),
  description: z.string().nullable(),
});
