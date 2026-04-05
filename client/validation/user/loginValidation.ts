import { z } from "zod";

export const loginValidationSchema = z.object({
  username: z
    .string({ message: "Name is required" })
    .min(5, { message: "Must be 5 or more characters long" }),
  password: z
    .string({
      message: "password is required",
    })
    .min(6, { message: "Must be 5 or more characters long" }),
});
