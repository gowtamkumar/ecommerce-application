import { z } from "zod";

export const shippingAddressValidationSchema = z.object({
  userId: z.number({
    required_error: "user is required",
  }),

  addressLine1: z.string({
    required_error: "address line 1 is required",
  }),

  addressLine2: z.string({
    required_error: "address line 2 is required",
  }),
  state: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});
