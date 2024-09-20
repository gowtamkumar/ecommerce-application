import { z } from "zod";

export const commentValidationSchema = z.object({
  postId: z.number({
    required_error: "Product is required",
  }),

  userId: z.number({
    required_error: "User is required",
  }),

  content: z.string({
    required_error: "User is required",
  }),
  status: z.enum(["Pending", "Rejected", "Approved"]).optional(),
});
