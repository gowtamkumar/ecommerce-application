import { z } from "zod";

export const currencyValidationSchema = z.object({
  name: z.string().optional(),
  userId: z.number({
    required_error: "User is required",
  }),
  symbol: z.string({
    required_error: "Value is required",
  }),
});
