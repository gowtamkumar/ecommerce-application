import { z } from "zod";

export const postValidationSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  image: z.string({
    required_error: "Image is required",
  }),
  tags: z.array(z.string()).optional(),
  content: z.string({
    required_error: "Content is required",
  }),
  userId: z.number({
    required_error: "User id is required",
  }),
  status: z.enum(["Draft", "Published", "Archived"], {
    required_error: "Status is required",
  }),
  postCategories: z
    .array(z.number())
    .nonempty({ message: "can't be empty!" }),
});
