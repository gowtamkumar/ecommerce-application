import { z } from "zod";

export const leadValidationSchema = z.object({
  email: z.string({
    required_error: "E-mail is required",
  }),
});
