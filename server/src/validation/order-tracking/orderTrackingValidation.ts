import { z } from "zod";

export const orderTrackingValidationSchema = z.object({
  date: z.string({
    required_error: "Date is required",
  }),

  orderId: z.string({
    required_error: "order id is required",
  }),
  note: z.string({ required_error: "Note is Required" }),
  status: z.enum([
    "Order Placed",
    "Order Approved",
    "Order Ready to Ship",
    "Order Handover to Courier",
    "Order Delivered",
  ]),
});
