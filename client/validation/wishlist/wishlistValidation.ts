import { z } from "zod";

export const WishListhValidationSchema = z.object({
  productId: z.number({
    message: "Product Id is required",
  }),
});
