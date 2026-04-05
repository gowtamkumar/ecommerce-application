import { z } from "zod";

export const checkoutValidationSchema = z.object({
  firstName: z.string({
    message: "firstName is required",
  }),
  lastName: z.string({
    message: "firstName is required",
  }),
  paymentMethod: z.enum(["creditCard", "paypal", "cash"]),
  email: z
    .string({
      message: "email is required",
    })
    .email(),
  address: z.string({
    message: "address is required",
  }),

  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expirationDate: z.string().optional(),
  cvc: z.string().optional(),
  // .transform((val) => val.split("@")[1]),
});
