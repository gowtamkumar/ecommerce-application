import { z } from "zod";

export const createStockAdjustValidation = z.object({
  productId: z.string({
    required_error: "ProductId is required",
  }),
  variantId: z.string({
    required_error: "VariantId is required",
  }),

  qty: z.number({
    required_error: "QTY is required",
  }),

  userId: z.number({
    required_error: "User is required",
  }),
});
