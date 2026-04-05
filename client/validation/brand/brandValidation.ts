import { z } from "zod";

export const brandValidationSchema = z.object({
  name: z.string({
    message: "name is required",
  }),
  status: z.enum(["Active", "Inactive"]).optional(),
});
