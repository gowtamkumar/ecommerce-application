import { z } from "zod";

export const statusValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
});
