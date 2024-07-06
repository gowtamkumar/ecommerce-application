import { z } from "zod";

export const categoriesValidationSchema = z.object({
  name: z.string({
    required_error: "name 1 is required",
  }),
  // urlSlug: z.string({
  //   required_error: "url slug is required",
  // }),

  userId: z.number({
    required_error: "User is required",
  }),

  parentId: z.number().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});
