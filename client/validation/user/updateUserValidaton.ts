import { z } from "zod";

export const updateUserValidationSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),

  email: z
    .string({
      message: "email is required",
    })
    .email(),
  gender: z.enum(["Male", "Female"]).optional(),
  phone: z.string().optional(),
  dob: z.string().optional(),
  image: z.string().optional(),
});
