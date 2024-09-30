import { z } from "zod";

export const currencyValidationSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  symbol: z.string({
    required_error: "symbol is required",
  }),
  userId: z.number({
    required_error: "user is required",
  }),
});
