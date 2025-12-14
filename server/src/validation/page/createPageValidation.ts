import { z } from 'zod';

export const createPageValidation = z.object({
  title: z.string({
    required_error: 'Title is required',
  }),
  slug: z.string({
    required_error: 'Slug is required',
  }),
  content: z.string({
    required_error: 'Content is required',
  }),
  contentType: z.enum(['html', 'markdown'], {
    required_error: 'Content type is required',
  }).default('markdown'),
  metaDescription: z.string().nullable().optional(),
  status: z.enum(['draft', 'published'], {
    required_error: 'Status is required',
  }).default('draft'),
  userId: z.number({
    required_error: 'User is required',
  }),
});
