import { z } from "zod";

export const updatePasswordValidationSchema = z.object({
  newPassword: z.string({
    required_error: "new Password is required",
  }),
  currentPassword: z.string({
    required_error: "current Password is required",
  }),
});
