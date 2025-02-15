import { z } from "zod";

export const brandValidationSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  image: z.string().optional(),
  userId: z.number({
    required_error: "user is required",
  }),
  status: z.enum(["Active", "Inactive"]).optional(),
});
