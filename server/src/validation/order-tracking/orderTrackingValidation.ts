import { z } from "zod";

export const orderTrackingValidationSchema = z.object({
  orderId: z.number({
    required_error: "Order is required",
  }),
  userId: z.number({
    required_error: "User is required",
  }),
  location: z.string().optional(),
  status: z.enum([
    "Order Placed",
    "Order Approved",
    "Order Ready to Ship",
    "Order Handover to Courier",
    "Order Delivered",
  ]),
});
