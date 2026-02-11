import { z } from 'zod';

export const createPageValidation = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .max(255),
  slug: z
    .string({
      required_error: 'Slug is required',
    })
    .max(255)
    .optional(), // Slug might be auto-generated or optional
  isHomePage: z.boolean().default(false).optional(),
  order: z.number().default(0).optional(),
  sections: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        settings: z.any().optional(),
        styles: z.any().optional(),
        disabled: z.boolean().optional(),
      })
    )
    .optional(),
  metaTitle: z.string().max(255).optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  typography: z
    .object({
      fontFamily: z.string().optional(),
      headingFont: z.string().optional(),
      baseFontSize: z.number().optional(),
      headingFontFamily: z.string().optional(),
      headingFontWeight: z.string().optional(),
      headingFontSize: z.string().optional(),
      headingLineHeight: z.string().optional(),
      paragraphFontFamily: z.string().optional(),
      paragraphFontWeight: z.string().optional(),
      paragraphFontSize: z.string().optional(),
      paragraphLineHeight: z.string().optional(),
    })
    .optional()
    .nullable(),
  status: z.enum(['draft', 'published']).default('published'),
  userId: z.string({
    required_error: 'User ID is required',
  }),
});
