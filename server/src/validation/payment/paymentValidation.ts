import { z } from "zod";

export const paymentValidationSchema = z.object({
  date: z.string({
    required_error: "Date is required",
  }),

  orderId: z.string({
    required_error: "Order is required",
  }),

  paymentMethod: z.string({
    required_error: "Order is required",
  }),
  amount: z.number({ required_error: "Amount is Required" }),
});
