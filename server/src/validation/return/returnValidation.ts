import { z } from "zod";

export const returnValidationSchema = z.object({
  orderId: z.number({
    required_error: "Order is required",
  }),
  productId: z.number({
    required_error: "Product is required",
  }),

  userId: z.number({
    required_error: "User is required",
  }),

  reason: z.string({
    required_error: "Reason is required",
  }),

  status: z.enum(
    ["Requested", "Approved", "Rejected", "Received", "Refunded"],
    {
      required_error: "status is required",
    }
  ),
});
