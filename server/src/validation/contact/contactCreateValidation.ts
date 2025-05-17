import { z } from "zod";

export const contactCreateValidation = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: z.string().optional(),
  phone: z.string({
    required_error: "phone is required",
  }),
  subject: z.string({
    required_error: "subject is required",
  }),
  message: z.string({
    required_error: "message is required",
  }),
});
