import { z } from "zod";

export const WishListhValidationSchema = z.object({
  productId: z.number({
    required_error: "Product Id is required",
  }),
});
