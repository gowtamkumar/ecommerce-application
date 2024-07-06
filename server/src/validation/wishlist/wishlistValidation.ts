import { z } from "zod";

export const wishListhValidationSchema = z.object({
  productId: z.number({
    required_error: "Product is required",
  }),
  userId: z.number({
    required_error: "User is required",
  }),
});
