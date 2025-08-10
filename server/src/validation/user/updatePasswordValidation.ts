import { z } from "zod";

export const updatePasswordValidationSchema = z.object({
  newPassword: z
    .string({
      required_error: "new Password is required",
    })
    .min(6, { message: "Must be 6 or more characters long" }),
  currentPassword: z
    .string({
      required_error: "current Password is required",
    })
    .min(6, { message: "Must be 6 or more characters long" }),
});
