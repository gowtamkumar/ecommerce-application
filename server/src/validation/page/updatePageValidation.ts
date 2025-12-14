import { z } from 'zod';

export const updatePageValidation = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
  contentType: z.enum(['html', 'markdown']).optional(),
  metaDescription: z.string().nullable().optional(),
  status: z.enum(['draft', 'published']).optional(),
});
