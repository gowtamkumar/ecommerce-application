import { z } from "zod";

export const UserUpdateValidationSchema = z.object({
  name: z
    .string()
    .transform((t) => t?.trim())
    .pipe(z.string().min(1)),

  email: z
    .string()
    .email()
    .transform((t) => t?.trim())
    .pipe(z.string().min(1)),

  phone: z.string().optional(),
  birthday: z.string().optional(),
  imgUrl: z.string().optional(),
  role: z.enum(["Admin", "User"]).optional(),
  status: z.enum(["Active", "Inactive", "Block"]).optional(),
});
