import { z } from "zod";

export const productColorValidationSchema = z.object({
  productId: z.string({
    required_error: "Product is required",
  }),
  colorId: z.string({
    required_error: "Color is required",
  }),
});
