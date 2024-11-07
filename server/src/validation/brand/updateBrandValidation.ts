import { z } from "zod";

export const updateBrandValidationSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  image: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});
