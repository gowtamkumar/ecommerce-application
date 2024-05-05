import { z } from "zod";

export const reviewValidationSchema = z.object({
  date: z.string({
    required_error: "Date is required",
  }),

  productId: z.string({
    required_error: "Product is required",
  }),

  // user_id: z.string({
  //   required_error: "User is required",
  // }),

  rating: z.number({ required_error: "Rating is Required" }),
  comment: z.string().optional(),
});
