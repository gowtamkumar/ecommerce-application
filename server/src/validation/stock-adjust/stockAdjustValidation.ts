import { z } from "zod";

export const createStockAdjustValidation = z.object({
  type: z.enum(["Subtract", "Add"], {
    required_error: "type is required",
  }),

  userId: z.number({
    required_error: "User is required",
  }),
  productId: z.number({
    required_error: "Product is required",
  }),
  productVariants: z
    .array(
      z.object({
        id: z.number({ required_error: "Product variant id is required" }),
        qty: z.number({
          required_error: "Stock Qty is required",
        }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
