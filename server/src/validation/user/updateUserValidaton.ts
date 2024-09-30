import { z } from "zod";

export const updateUserValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  image: z.string({ required_error: "Name is required" }).optional(),
  username: z
    .string({ required_error: "Name is required" })
    .min(5, { message: "Must be 5 or more characters long" }),
  email: z
    .string({
      required_error: "email is required",
    })
    .email(),
  role: z.enum(["Admin", "User"]).optional(),
  dob: z.string().optional(),
  type: z.enum(["Customer", "Vendor", "Delivery Man", "Admin"]).optional(),
  status: z.enum(["Active", "Inactive", "Block"]).optional(),
});
