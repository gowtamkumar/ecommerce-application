import { z } from "zod";

export const updateReviewValidationSchema = z.object({
  productId: z.number().optional(),
  rating: z.number().optional(),
  comment: z.string().optional(),
  status: z.enum(["Pending", "Rejected", "Approved"]).optional(),
});
