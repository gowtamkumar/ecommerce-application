import { z } from "zod";

export const paymentValidationSchema = z.object({
  paymentDate: z.string({
    required_error: "Date is required",
  }),
  orderId: z.number().optional(),
  userId: z.number({
    required_error: "User is required",
  }),
  paymentMethod: z.string({
    required_error: "Payment method is required",
  }),
  amount: z.number({ required_error: "Amount is Required" }),
});
