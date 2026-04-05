import { z } from "zod";

export const categoriesValidationSchema = z.object({
  name: z.string({
    message: "name 1 is required",
  }),
  // slug: z.string({
  //   message: "url slug is required",
  // }),

  userId: z.string().optional(),

  parentId: z.number().optional(),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});
