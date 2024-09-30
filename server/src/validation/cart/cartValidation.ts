import { z } from "zod";

export const cartValidationSchema = z.object({
  productId: z.number({
    required_error: "Product is required",
  }),
  productVariantId: z.number({
    required_error: "Product Variant is required",
  }),
  qty: z.number({ required_error: "Qty is Required" }),
  userId: z.number({
    required_error: "User is required",
  }),
});
