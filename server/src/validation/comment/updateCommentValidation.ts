import { z } from 'zod';

export const updateCommentValidationSchema = z.object({
  postId: z.number({
    required_error: 'Product is required',
  }),

  content: z.string({
    required_error: 'Content is required',
  }),
  status: z.enum(['Pending', 'Rejected', 'Approved']).optional(),
});
