import { z } from "zod";

export const addressValidationSchema = z.object({
  type: z.enum(["Office", "Home"], {
    required_error: "Type is required",
  }),
  userId: z.number({
    required_error: "user is required",
  }),
  name: z.string({
    required_error: "name is required",
  }),
  email: z.string().optional(),
  phoneNo: z.string({
    required_error: "Phone No is required",
  }),
  alternativPhoneNo: z.string().optional(),
  country: z.string({
    required_error: "Country is required",
  }),
  city: z.string({
    required_error: "City is required",
  }),
  thana: z.string({
    required_error: "Thana is required",
  }),
  union: z.string({
    required_error: "Union is required",
  }),
  zipCode: z.string().optional(),
  address: z.string({
    required_error: "Address is required",
  }),
});
