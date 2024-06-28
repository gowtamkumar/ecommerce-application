import { z } from "zod";

export const orderTrackingValidationSchema = z.object({
  location: z.string().optional(),
  status: z.enum([
    "Order Placed",
    "Order Approved",
    "Order Ready to Ship",
    "Order Handover to Courier",
    "Order Delivered",
  ]),
});
