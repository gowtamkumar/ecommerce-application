import { z } from "zod";

export const updateUserValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),

  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: " must be  Email a string",
    })
    .email(),
  gender: z.enum(["Male", "Female"]).optional(),
  phone: z.string().optional(),
  dob: z.any().optional(),
  image: z.string().optional(),
});
