import { z } from "zod";

export const productCategoryValidationSchema = z.object({
  productId: z.string({
    required_error: "Product is required",
  }),
  categoryId: z.string({
    required_error: "category is required",
  }),
});
