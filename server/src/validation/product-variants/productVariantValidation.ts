import { z } from "zod";

export const productVariantValidationSchema = z.object({
  price: z.number({ required_error: "Regular Price is required" }),
  purchasePrice: z.number({ required_error: "Purchase Price is required" }),
  sizeId: z.string().optional(),
  stockQty: z.number({ required_error: "Stock Qty is required" }),
  // stockStatus: z.enum(["In Stock", "Out Stock"]).optional(),
});
