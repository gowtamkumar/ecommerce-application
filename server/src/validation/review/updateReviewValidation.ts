import { z } from "zod";

export const updateReviewValidationSchema = z.object({
  productId: z.number({
    required_error: "Product is required",
  }),

  rating: z.number({ required_error: "Rating is Required" }),
  comment: z.string().optional(),
  status: z.enum(["Pending", "Rejected", "Approved"]).optional(),
});
