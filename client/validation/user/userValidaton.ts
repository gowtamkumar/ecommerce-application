import { z } from "zod";

export const UserValidationSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),
  username: z
    .string({ message: "Name is required" })
    .min(5, { message: "Must be 5 or more characters long" }),
  password: z
    .string({
      message: "password is required",
    })
    .min(6, { message: "Must be 5 or more characters long" }),
  email: z
    .string({
      message: "email is required",
    })
    .email(),

  resetToken: z.string().optional(),
  resetTokenExpire: z.number().optional(),
  role: z.enum(["Admin", "User"]).optional(),
  status: z.boolean().optional(),
});
