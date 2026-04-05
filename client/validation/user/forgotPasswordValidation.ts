import { z } from "zod";

export const forgotPasswordValidationSchema = z.object({
  email: z
    .string({
      message: "email is required",
    })
    .email()
    // .transform((val) => val.split("@")[1]),
});
