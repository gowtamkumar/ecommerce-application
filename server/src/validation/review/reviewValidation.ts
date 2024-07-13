import { z } from "zod";

export const reviewValidationSchema = z.object({
  productId: z.number({
    required_error: "Product is required",
  }),

  userId: z.number({
    required_error: "User is required",
  }),

  rating: z.number({ required_error: "Rating is Required" }),
  comment: z.string().optional(),
  status: z.enum(["Pending", "Rejected", "Approved"]).optional(),
});
